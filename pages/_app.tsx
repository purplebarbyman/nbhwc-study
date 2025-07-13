import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { StudyProvider } from '@/contexts/StudyContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
    }
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading NBHWC Study Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <StudyProvider>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </StudyProvider>
    </ErrorBoundary>
  )
}
