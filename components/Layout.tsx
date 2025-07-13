import { ReactNode } from 'react'
import Head from 'next/head'
import Navigation from '@/components/Navigation'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title = 'NBHWC Study Platform' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Interactive NBHWC Certification Study Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>{children}</main>
      </div>
    </>
  )
}
