import type { Metadata, Viewport } from 'next';
import { Outfit, Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { TimezoneProvider } from '@/context/TimezoneContext';
import { cricketService } from '@/services/cricketService';
import { LiveTickerBar } from '@/components/layout/LiveTickerBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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
  title: 'CricLive — Professional Cricket Live Scores, Match Center & Analytics',
  description:
    'Real-time cricket live scores, ball-by-ball commentary, tournament schedules, recent results, and official ICC rankings. Clean, dark-mode high performance sports data platform.',
  applicationName: 'CricLive',
  keywords: [
    'cricket live score',
    'cricket match center',
    'live cricket scorecard',
    'ICC Champions Trophy 2026',
    'World Test Championship',
    'IPL 2026 schedule',
    'ICC cricket rankings',
    'CricLive',
  ],
  authors: [{ name: 'CricLive Data & Analytics' }],
};

export const viewport: Viewport = {
  themeColor: '#05080F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const liveMatches = await cricketService.getLiveMatches();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#05080F] font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        <TimezoneProvider>
          {/* Atmospheric Stadium Floodlight Glow */}
          <div className="pointer-events-none fixed inset-0 z-0 stadium-glow opacity-80" />

          {/* App Shell */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <LiveTickerBar initialMatches={liveMatches} />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </TimezoneProvider>
      </body>
    </html>
  );
}
