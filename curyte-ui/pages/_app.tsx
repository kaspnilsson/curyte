import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import 'remixicon/fonts/remixicon.css'
import '../styles/index.css'
import '../styles/app.scss'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ImageUploadDialogProvider } from '../components/dialogs/ImageUploadDialog/ImageUploadDialogContext'
import { exception, pageview } from '../utils/gtag'
import ErrorBoundary from '../components/ErrorBoundary'
import theme from '../styles/theme'
import supabase from '../supabase/client'
import { User } from '@supabase/supabase-js'

export default function CuryteApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async () =>
      checkUser()
    )
    checkUser()
    return () => {
      authListener?.unsubscribe()
    }
  }, [])
  async function checkUser() {
    const user = supabase.auth.user()
    setUser(user)
  }

  useEffect(() => {
    window.onerror = function (msg, source, lineNo, columnNo, error) {
      exception(
        'Error: ' +
          msg +
          '\nScript: ' +
          source +
          '\nLine: ' +
          lineNo +
          '\nColumn: ' +
          columnNo +
          '\nStackTrace: ' +
          error
      )
      return true
    }
  })

  return (
    <ChakraProvider portalZIndex={20} theme={theme}>
      <ImageUploadDialogProvider>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </ImageUploadDialogProvider>
    </ChakraProvider>
  )
}
