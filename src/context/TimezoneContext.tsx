'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useSyncExternalStore,
  useCallback,
} from 'react';

export type TimezoneMode = 'local' | 'utc';

interface TimezoneContextType {
  timezoneMode: TimezoneMode;
  toggleTimezoneMode: () => void;
  setTimezoneMode: (mode: TimezoneMode) => void;
  formatMatchTime: (utcIsoString: string) => string;
  formatDate: (utcIsoString: string) => string;
  currentClock: string;
  timezoneLabel: string;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'livecric_timezone_mode';

// Clock subscription store with stable snapshot reference
let currentClockTime = typeof window !== 'undefined' ? Date.now() : 0;

function subscribeClock(onStoreChange: () => void) {
  const timer = setInterval(() => {
    currentClockTime = Date.now();
    onStoreChange();
  }, 1000);
  return () => clearInterval(timer);
}

function getClockSnapshot(): number {
  return currentClockTime;
}

function getClockServerSnapshot(): number {
  return 0;
}

// Timezone label subscription store
function subscribeTimezone() {
  return () => {};
}

function getTimezoneLabelSnapshot(): string {
  try {
    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offsetMinutes = -new Date().getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const paddedHours = String(offsetHours).padStart(2, '0');
    const regionName = timeZoneName.split('/').pop()?.replace(/_/g, ' ') || 'Local';
    return `${regionName} (UTC${sign}${paddedHours})`;
  } catch {
    return 'Local Time';
  }
}

function getTimezoneLabelServerSnapshot(): string {
  return 'Local Time';
}

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [overrideMode, setOverrideMode] = useState<TimezoneMode | null>(null);

  // Subscribe to clock ticks
  const currentTimestamp = useSyncExternalStore(
    subscribeClock,
    getClockSnapshot,
    getClockServerSnapshot
  );

  // Client timezone label (pure on server, resolved on client)
  const clientTimezoneLabel = useSyncExternalStore(
    subscribeTimezone,
    getTimezoneLabelSnapshot,
    getTimezoneLabelServerSnapshot
  );

  // Read stored preference safely
  const storedMode = useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    (): TimezoneMode => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored === 'utc' ? 'utc' : 'local';
      } catch {
        return 'local';
      }
    },
    (): TimezoneMode => 'local'
  );

  const timezoneMode = overrideMode ?? storedMode;

  const setTimezoneMode = useCallback((mode: TimezoneMode) => {
    setOverrideMode(mode);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, mode);
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const toggleTimezoneMode = useCallback(() => {
    const next = timezoneMode === 'local' ? 'utc' : 'local';
    setTimezoneMode(next);
  }, [timezoneMode, setTimezoneMode]);

  // Formatted live digital clock display
  const currentClock = useMemo(() => {
    if (currentTimestamp === 0) return '--:--:--';
    const now = new Date(currentTimestamp);
    if (timezoneMode === 'utc') {
      return now.toISOString().substring(11, 19) + ' UTC';
    }
    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }, [currentTimestamp, timezoneMode]);

  // Display timezone label based on mode
  const timezoneLabel = useMemo(() => {
    if (timezoneMode === 'utc') return 'UTC (GMT+0)';
    return clientTimezoneLabel;
  }, [timezoneMode, clientTimezoneLabel]);

  const formatMatchTime = useCallback(
    (utcIsoString: string): string => {
      try {
        const date = new Date(utcIsoString);
        if (isNaN(date.getTime())) return utcIsoString;

        if (timezoneMode === 'utc') {
          const hours = String(date.getUTCHours()).padStart(2, '0');
          const minutes = String(date.getUTCMinutes()).padStart(2, '0');
          return `${hours}:${minutes} UTC`;
        }

        return date.toLocaleTimeString('en-US', {
          timeZone: 'UTC', // fallback during SSR
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } catch {
        return utcIsoString;
      }
    },
    [timezoneMode]
  );

  const formatDate = useCallback(
    (utcIsoString: string): string => {
      try {
        const date = new Date(utcIsoString);
        if (isNaN(date.getTime())) return utcIsoString;

        return date.toLocaleDateString('en-GB', {
          timeZone: 'UTC',
          day: 'numeric',
          month: 'short',
        });
      } catch {
        return utcIsoString;
      }
    },
    []
  );

  return (
    <TimezoneContext.Provider
      value={{
        timezoneMode,
        toggleTimezoneMode,
        setTimezoneMode,
        formatMatchTime,
        formatDate,
        currentClock,
        timezoneLabel,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone(): TimezoneContextType {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
}
