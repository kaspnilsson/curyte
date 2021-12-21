import { extendTheme } from '@chakra-ui/react'
import { indigo } from './colors'
import components from './components'

const theme = extendTheme({
  colors: {
    indigo,
  },
  components,
})

export default theme
