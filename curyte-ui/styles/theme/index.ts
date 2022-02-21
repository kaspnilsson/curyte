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
  styles: {
    global: {
      // Create a CSS variable with the focus ring color desired.
      // rgba function does not work here so use the hex value.
      // Either :host,:root or html work. body does not work for
      // button, checkbox, radio, switch.
      // html: {
      ':host,:root': {
        '--chakra-ui-focus-ring-color': 'var(--chakra-colors-violet-500)',
      },
    },
  },
  shadows: {
    // This is also possible. Not sure I like inject this into
    // an existing theme section.
    // It creates a CSS variable named --chakra-shadows-focus-ring-color
    // 'focus-ring-color': 'rgba(255, 0, 125, 0.6)',
    outline: '0 0 0 3px var(--chakra-ui-focus-ring-color)',
  },
} as ThemeConfig)

export default theme
