import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import 'remixicon/fonts/remixicon.css'
import '../styles/index.css'
import '../styles/app.scss'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ImageUploadDialogProvider } from '../components/dialogs/ImageUploadDialog/ImageUploadDialogContext'
import { exception, pageview } from '../utils/gtag'
import ErrorBoundary from '../components/ErrorBoundary'
import theme from '../styles/theme'
import supabase from '../supabase/client'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { UserAuthProvider } from '../contexts/user'

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

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = supabase.auth.user()
        updateSupabaseCookie(event, session)
        if (event === 'SIGNED_IN' && user) {
          // Ensure users always have profiles.
          fetch(`/api/profiles/${user.id}`, {
            method: 'POST',
            body: JSON.stringify({ uid: user.id }),
          })
        }
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  })

  const updateSupabaseCookie = async (
    event: AuthChangeEvent,
    session: Session | null
  ) =>
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })

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
      <UserAuthProvider>
        <ImageUploadDialogProvider>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </ImageUploadDialogProvider>
      </UserAuthProvider>
    </ChakraProvider>
  )
}
