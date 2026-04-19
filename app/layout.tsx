import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import { ShutdownOverlay } from '@/components/shutdown-overlay'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-display'
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: 'Locus Tutoring | Free QCE Tutoring',
  description: 'Quality tutoring shouldn\'t cost a fortune. Join our free weekly livestreams and access our complete video library. Free QCE tutoring, accessible to everyone.',
  generator: 'locuseducation.com',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <ClerkProvider>
          <ShutdownOverlay />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ClerkProvider>
      </body>
    </html>
  )
}
