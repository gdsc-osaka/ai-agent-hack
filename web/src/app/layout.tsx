import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'
import './gradient.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Bar Customer Management System',
    template: '%s | Bar CMS'
  },
  description: 'バーの顧客管理システム - 顧客情報、注文履歴、会話トピックを効率的に管理',
  keywords: ['bar', 'customer management', 'CRM', 'バー', '顧客管理', 'hospitality', 'サービス業'],
  authors: [{ name: 'Bar CMS Team' }],
  creator: 'Bar CMS',
  publisher: 'Bar CMS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://bar-cms.example.com',
    title: 'Bar Customer Management System',
    description: 'バーの顧客管理システム - 顧客情報、注文履歴、会話トピックを効率的に管理',
    siteName: 'Bar CMS',
    images: [
      {
        url: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg',
        width: 1200,
        height: 630,
        alt: 'Bar Customer Management System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bar Customer Management System',
    description: 'バーの顧客管理システム - 顧客情報、注文履歴、会話トピックを効率的に管理',
    images: ['https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased mesh-gradient-bg min-h-screen bg-gray-900`}>
        {children}
      </body>
    </html>
  )
}
