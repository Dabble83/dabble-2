// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Fraunces, Inter } from 'next/font/google'
import { flags } from '../lib/flags'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dabble - Try something new, wherever you are',
  description: 'Learn by dabbling with people near you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded"
          style={{ background: '#2d5016', color: '#fff' }}
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="w-full" style={{ 
      paddingTop: '32px',
      paddingBottom: '16px',
      paddingLeft: '24px',
      paddingRight: '24px',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <nav className="flex justify-between items-center max-w-1200px mx-auto" style={{ maxWidth: '1200px' }}>
        <Link
          href="/"
          className="font-bold"
          style={{
            fontSize: '40px',
            color: '#2d5016',
            fontWeight: '700',
            fontFamily: 'var(--font-fraunces, Georgia, serif)',
            textDecoration: 'none'
          }}
        >
          Dabble
        </Link>
        <div className="flex items-center gap-6" style={{ gap: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
          <Link 
            href="/explore" 
            className="link-primary text-sm font-medium"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Explore
          </Link>
          <Link 
            href="/about" 
            className="link-primary text-sm font-medium"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            About
          </Link>
          <Link 
            href="/dabble/signin" 
            className="link-primary text-sm font-medium"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Sign In
          </Link>
          <Link 
            href="/dabble/signup" 
            className="btn-primary text-sm"
            style={{ fontSize: '14px', padding: '10px 20px' }}
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="w-full mt-auto py-8" style={{ 
      borderTop: '1px solid #e5e7eb',
      marginTop: '64px',
      paddingTop: '32px',
      paddingBottom: '32px'
    }}>
      <div className="max-w-1200px mx-auto px-6" style={{ maxWidth: '1200px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: '#6B7280', fontSize: '14px', fontFamily: '-apple-system, sans-serif' }}>
            © {new Date().getFullYear()} Dabble. Built for community.
          </p>
          <nav className="flex gap-6" style={{ gap: '24px' }}>
            <Link href="/about" className="link-primary text-sm" style={{ fontSize: '14px' }}>
              About
            </Link>
            {flags.safetyPagesEnabled && (
              <>
                <Link href="/safety" className="link-primary text-sm" style={{ fontSize: '14px' }}>
                  Safety
                </Link>
                <Link href="/guidelines" className="link-primary text-sm" style={{ fontSize: '14px' }}>
                  Guidelines
                </Link>
              </>
            )}
            {process.env.NODE_ENV === 'development' && (
              <Link href="/debug/routes" className="link-primary text-sm" style={{ fontSize: '14px' }}>
                Debug
              </Link>
            )}
          </nav>
        </div>
      </div>
    </footer>
  )
}
