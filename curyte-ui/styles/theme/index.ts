import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { black, sky, zinc } from './colors'
import components from './components'

const theme = extendTheme({
  colors: {
    sky,
    zinc,
    black,
    gray: { ...zinc },
  },
  components,
} as ThemeConfig)

export default theme
