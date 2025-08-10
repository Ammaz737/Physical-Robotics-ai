import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PWARegistration from '@/components/PWARegistration'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'POS System',
  description: 'Point of Sale System with offline capabilities',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="POS System" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <PWARegistration>
          {children}
        </PWARegistration>
      </body>
    </html>
  )
}
