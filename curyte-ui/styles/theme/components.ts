import { ThemeComponents } from '@chakra-ui/react'
import { zinc } from './colors'

const components: Partial<ThemeComponents> = {
  Menu: {
    parts: ['menu', 'item'],
    baseStyle: {
      item: {
        _hover: {
          backgroundColor: zinc[100],
        },
      },
    },
  },
}

export default components
