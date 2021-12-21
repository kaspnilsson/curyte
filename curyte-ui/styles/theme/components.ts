import { ThemeComponents } from '@chakra-ui/react'
import { indigo } from './colors'

const components: Partial<ThemeComponents> = {
  Menu: {
    parts: ['menu', 'item'],
    baseStyle: {
      item: {
        _hover: {
          backgroundColor: indigo[100],
        },
      },
    },
  },
}

export default components
