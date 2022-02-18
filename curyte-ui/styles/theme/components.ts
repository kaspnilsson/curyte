import { ThemeComponents } from '@chakra-ui/react'
import { zinc } from './colors'

const variantOutlined = () => ({
  field: {
    _focus: {
      borderColor: 'var(--chakra-ui-focus-ring-color)',
      boxShadow: '0 0 0 2px var(--chakra-ui-focus-ring-color)',
    },
  },
})

const variantFilled = () => ({
  field: {
    _focus: {
      borderColor: 'var(--chakra-ui-focus-ring-color)',
      boxShadow: '0 0 0 1px var(--chakra-ui-focus-ring-color)',
    },
  },
})

const variantFlushed = () => ({
  field: {
    _focus: {
      borderColor: 'var(--chakra-ui-focus-ring-color)',
      boxShadow: '0 1px 0 0 var(--chakra-ui-focus-ring-color)',
    },
  },
})

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
  Input: {
    variants: {
      outline: variantOutlined,
      filled: variantFilled,
      flushed: variantFlushed,
    },
  },
  Select: {
    variants: {
      outline: variantOutlined,
      filled: variantFilled,
      flushed: variantFlushed,
    },
  },
  Textarea: {
    variants: {
      outline: () => variantOutlined().field,
      filled: () => variantFilled().field,
      flushed: () => variantFlushed().field,
    },
  },
}

export default components
