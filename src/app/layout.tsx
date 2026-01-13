import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Brand Lift Simulator | Abstrakt Marketing Group',
  description: 'AI-powered brand lift and media planning simulator. See how branded paid media drives demand capture and AI Search visibility.',
  keywords: 'brand lift, media planning, AI search, SEO, paid media, B2B marketing',
  openGraph: {
    title: 'Brand Lift Simulator | Abstrakt Marketing Group',
    description: 'Discover how branded paid media drives demand capture and AI Search visibility.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
