import type { Metadata } from 'next'
import { Space_Mono, Inter } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})

const inter = Inter({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-sans',
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kostiantyn Keilin',
  jobTitle: 'Senior Front-End Engineer',
  url: 'https://koskei.com',
  email: 'keilinkostiantyn@gmail.com',
  telephone: '+19059621211',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Toronto',
    addressRegion: 'Ontario',
    addressCountry: 'CA',
  },
  sameAs: [
    'https://github.com/KKeylin',
    'https://www.linkedin.com/in/kostiantyn-keilin/',
    'https://medium.com/@kostiantyn.keilin',
    'https://www.npmjs.com/~kkeylin',
  ],
}

export const metadata: Metadata = {
  title: 'Kostiantyn Keilin — Senior Front-End Engineer',
  description:
    'Senior Front-End Engineer with 15+ years of experience. React, TypeScript, micro-frontends, config-driven architecture. Based in Toronto, Ontario.',
  metadataBase: new URL('https://koskei.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://koskei.com',
    title: 'Kostiantyn Keilin — Senior Front-End Engineer',
    description:
      'Senior Front-End Engineer with 15+ years of experience. React, TypeScript, micro-frontends, config-driven architecture. Based in Toronto, Ontario.',
    images: [{ url: '/photo.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kostiantyn Keilin — Senior Front-End Engineer',
    description:
      'Senior Front-End Engineer with 15+ years of experience. React, TypeScript, micro-frontends, config-driven architecture. Based in Toronto, Ontario.',
    images: ['/photo.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}