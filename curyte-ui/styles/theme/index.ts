import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { black, violet, zinc } from './colors'
import components from './components'

const theme = extendTheme({
  colors: {
    violet,
    zinc,
    black,
    gray: { ...zinc },
  },
  components,
} as ThemeConfig)

export default theme
