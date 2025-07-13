import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { StudyProvider } from '@/contexts/StudyContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Prevent hydration issues
    const handleError = (event: ErrorEvent) => {
      console.log('Global error:', event.error)
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return (
    <ErrorBoundary>
      <StudyProvider>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </StudyProvider>
    </ErrorBoundary>
  )
}
