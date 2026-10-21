'use client';

import React, { useState, useEffect, useRef } from 'react';
import type Hls from 'hls.js';
import { CricketChannelFixture, StreamSource } from '@/types/cricket';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Radio,
  Server,
  AlertTriangle,
  RotateCcw,
  Wifi,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BroadcastPlayerProps {
  fixture: CricketChannelFixture;
}

export function BroadcastPlayer({ fixture }: BroadcastPlayerProps) {
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHlsReady, setIsHlsReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSource: StreamSource | undefined =
    fixture.streamSources[selectedSourceIndex] ?? fixture.streamSources[0];

  const isIframe = currentSource?.type === 'IFRAME';
  const isLoading = !isIframe && !isHlsReady && !hasError;

  // Initialize HLS Stream or Native Player
  useEffect(() => {
    if (!currentSource || currentSource.type !== 'HLS') return;

    let hlsInstance: Hls | null = null;
    const video = videoRef.current;
    if (!video) return;

    import('hls.js').then(({ default: HlsClass }) => {
      if (HlsClass.isSupported()) {
        hlsInstance = new HlsClass({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hlsInstance.loadSource(currentSource.embedUrl);
        hlsInstance.attachMedia(video);

        hlsInstance.on(HlsClass.Events.MANIFEST_PARSED, () => {
          setIsHlsReady(true);
          video.play().catch(() => {
            setIsMuted(true);
            video.muted = true;
            video.play().catch(() => {});
          });
        });

        hlsInstance.on(HlsClass.Events.ERROR, (_event: unknown, data: { fatal?: boolean }) => {
          if (data.fatal) {
            setHasError(true);
            setErrorMessage('Live transponder signal interrupted. Try alternative server.');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari / iOS HLS
        video.src = currentSource.embedUrl;
        const onLoaded = () => {
          setIsHlsReady(true);
          video.play().catch(() => {
            setIsMuted(true);
            video.muted = true;
            video.play().catch(() => {});
          });
        };
        video.addEventListener('loadedmetadata', onLoaded, { once: true });
      }
    });

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [currentSource]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSelectSource = (index: number) => {
    setSelectedSourceIndex(index);
    setIsHlsReady(false);
    setHasError(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-4">
      {/* Primary Video Container */}
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl group"
      >
        {/* Stream Content */}
        {isIframe ? (
          <iframe
            src={currentSource?.embedUrl}
            title={fixture.title}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
          />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted={isMuted}
            className="h-full w-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm space-y-3">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
              <Radio className="h-6 w-6 text-emerald-400 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-100">
                Locking Transponder Satellite Feed...
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {currentSource?.label || 'Resolving direct edge route'}
              </p>
            </div>
          </div>
        )}

        {/* Fallback / Error Overlay */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070B14]/95 p-6 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="font-display text-base font-bold text-white">
                Live Uplink Notice
              </h4>
              <p className="text-xs text-slate-300">
                {errorMessage || 'Direct stream source temporarily negotiating satellite key.'}
              </p>
            </div>

            {/* Quick Switch Server Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {fixture.streamSources.map((srv, idx) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => handleSelectSource(idx)}
                  className={cn(
                    'tv-focusable flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                    idx === selectedSourceIndex
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
                  )}
                >
                  <Server className="h-3 w-3" />
                  <span>Switch to Server {idx + 1}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setHasError(false);
                setIsHlsReady(false);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono underline underline-offset-4"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Retry Current Feed</span>
            </button>
          </div>
        )}

        {/* Top HUD Overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
          <div className="flex items-center space-x-2 pointer-events-auto">
            <span className="font-mono text-xs font-black bg-white/10 border border-white/15 px-2 py-0.5 rounded text-white backdrop-blur-md">
              CH 0{fixture.channelNumber}
            </span>
            <span className="text-xs font-bold text-slate-200 drop-shadow line-clamp-1">
              {fixture.shortTitle} • {fixture.title}
            </span>
          </div>

          <div className="flex items-center space-x-2 pointer-events-auto">
            {fixture.status === 'LIVE' ? (
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-rose-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-rose-500/50 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span>LIVE ON AIR</span>
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                {fixture.status}
              </span>
            )}
            <span className="hidden sm:inline-flex rounded bg-black/60 border border-white/15 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 backdrop-blur-md">
              1080p 50FPS
            </span>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between opacity-95 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={togglePlay}
              className="tv-focusable flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all border border-white/10"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="tv-focusable flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all border border-white/10"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-300 bg-black/40 px-3 py-1 rounded-lg border border-white/10">
              <Wifi className="h-3 w-3 text-emerald-400" />
              <span>Delay: ~1.2s</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="tv-focusable flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all border border-white/10"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Redundant Stream Source Selector Strip */}
      <div className="rounded-xl border border-white/10 bg-[#0B111E] p-3 glass-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Broadcast Transponder Feeds
            </span>
          </div>

          {/* Sources Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {fixture.streamSources.map((source, index) => {
              const isSelected = index === selectedSourceIndex;
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => handleSelectSource(index)}
                  className={cn(
                    'tv-focusable flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                    isSelected
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-bold'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                  )}
                >
                  <span className="font-mono text-[10px]">SRC {index + 1}</span>
                  <span>{source.label.split('(')[0]?.trim() || `Server ${index + 1}`}</span>
                  {source.type === 'HLS' && (
                    <span
                      className={cn(
                        'text-[9px] px-1 py-0.2 rounded font-mono',
                        isSelected ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-400'
                      )}
                    >
                      HLS
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
