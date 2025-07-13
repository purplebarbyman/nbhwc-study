import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { StudyProvider } from '@/contexts/StudyContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StudyProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </StudyProvider>
  )
}
