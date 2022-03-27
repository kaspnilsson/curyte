import { AppProps } from 'next/app'
import 'remixicon/fonts/remixicon.css'
import '../styles/index.css'
import '../styles/app.scss'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { exception, pageview } from '../utils/gtag'
import CuryteUIProviders from '../contexts/CuryteUIProviders'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
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
    <UserProvider supabaseClient={supabaseClient}>
      {/* UserProvider used within UserAuthProvider */}
      <UserAuthProvider>
        <CuryteUIProviders>
          <Component {...pageProps} />
        </CuryteUIProviders>
      </UserAuthProvider>
    </UserProvider>
  )
}
