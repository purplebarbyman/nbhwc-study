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
      setMounted(true)
    } catch (error) {
      console.error('App mounting error:', error)
      setHasError(true)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-600 mb-4">Failed to load the study platform.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
