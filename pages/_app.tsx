import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { StudyProvider } from '@/contexts/StudyContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    try {
      // Prevent hydration mismatches
      setMounted(true)
      
      // Global error handlers
      const handleError = (event: ErrorEvent) => {
        console.error('Global error:', event.error)
        setHasError(true)
      }
      
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        console.error('Unhandled promise rejection:', event.reason)
      }
      
      const handleResourceError = (event: Event) => {
        console.error('Resource loading error:', event)
      }
      
      window.addEventListener('error', handleError)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)
      window.addEventListener('load', handleResourceError)
      
      return () => {
        window.removeEventListener('error', handleError)
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
        window.removeEventListener('load', handleResourceError)
      }
    } catch (error) {
      console.error('App initialization error:', error)
      setHasError(true)
    }
  }, [])

  // Error fallback
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-bold text-red-900 mb-4">
              NBHWC Study Platform Error
            </h1>
            <p className="text-red-700 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">NBHWC Study Platform</h1>
          <p className="text-gray-600">Loading your study environment...</p>
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
