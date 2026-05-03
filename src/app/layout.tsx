// app/layout.tsx
// Root layout — applies fonts, global styles, toast provider

import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'FUAI — AI-Powered Content Transformation',
  description: 'Transform your content with the power of AI. Rewrite, summarize, expand, translate, and more.',
  keywords: ['AI writing', 'content generation', 'text rewriter', 'AI tools'],
  openGraph: {
    title: 'FUAI',
    description: 'AI-powered content transformation platform',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-slate-100 font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#0ea5e9', secondary: '#0f172a' } },
          }}
        />
      </body>
    </html>
  )
}
