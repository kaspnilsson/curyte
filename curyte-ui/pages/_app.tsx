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
