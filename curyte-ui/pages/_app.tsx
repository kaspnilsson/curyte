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
import { exploreRoute } from '../utils/routes'

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

  const user = supabase.auth.user()

  if (user) {
    debugger
    supabase.auth.signOut()
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        debugger
        handleAuthSession(event, session)
        if (event === 'SIGNED_IN') {
          const signedInUser = supabase.auth.user()
          if (!signedInUser) return
          const userId = signedInUser.id
          supabase
            .from('profiles')
            .upsert({ id: userId })
            .then(({ error }) => {
              if (!error) {
                router.push(exploreRoute)
              }
            })
        }
        if (event === 'SIGNED_OUT') {
          router.push(exploreRoute)
        }
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    if (user) {
      if (router.pathname === '/signin') {
        router.push('/')
      }
    }
  }, [router.pathname, user, router])

  const handleAuthSession = async (
    event: AuthChangeEvent,
    session: Session | null
  ) => {
    if (!session) return
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })
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
