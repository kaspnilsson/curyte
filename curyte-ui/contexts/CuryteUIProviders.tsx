import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FileUploadDialogProvider } from '../components/dialogs/FileUploadDialog/FileUploadDialogContext'
import { ImageUploadDialogProvider } from '../components/dialogs/ImageUploadDialog/ImageUploadDialogContext'
import ErrorBoundary from '../components/ErrorBoundary'
import theme from '../styles/theme'

interface Props {
  children: ReactNode
}

const CuryteUIProviders = ({ children }: Props) => (
  <ChakraProvider portalZIndex={20} theme={theme}>
    {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}
    <ImageUploadDialogProvider>
      <FileUploadDialogProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </FileUploadDialogProvider>
    </ImageUploadDialogProvider>
  </ChakraProvider>
)

export default CuryteUIProviders
