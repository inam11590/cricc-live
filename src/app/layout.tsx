import type { Metadata, Viewport } from 'next';
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { TimezoneProvider } from '@/context/TimezoneContext';
import { LiveTickerBar } from '@/components/layout/LiveTickerBar';
import { BroadcastHeader } from '@/components/layout/BroadcastHeader';
import { BroadcastFooter } from '@/components/layout/BroadcastFooter';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Livecric — Browser-Native Live Cricket Streaming Matrix',
  description:
    'Ultra-low-latency live cricket streaming directly in your browser. Curated 6-channel monthly broadcast matrix for desktop, mobile PWA, and Smart TVs with zero friction.',
  applicationName: 'Livecric',
  keywords: [
    'cricket live stream',
    'live cricket streaming',
    'browser cricket streaming',
    'smart tv cricket',
    'webcric live',
    'world test championship live',
    'wbbl live stream',
  ],
  authors: [{ name: 'Livecric Broadcast Network' }],
};

export const viewport: Viewport = {
  themeColor: '#05080F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#05080F] font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        <TimezoneProvider>
          {/* Atmospheric Floodlight Background Glow */}
          <div className="pointer-events-none fixed inset-0 z-0 stadium-glow opacity-80" />

          {/* Broadcast App Shell */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <LiveTickerBar />
            <BroadcastHeader />
            <main className="flex-1">{children}</main>
            <BroadcastFooter />
          </div>
        </TimezoneProvider>
      </body>
    </html>
  );
}
