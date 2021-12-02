import { AppProps } from 'next/app'
import '../styles/index.css'
import { ChakraProvider } from '@chakra-ui/react'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
