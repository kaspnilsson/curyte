import { Editor, Range } from '@tiptap/react'
import React, { useState } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css' // optional
import { MenuList } from '@chakra-ui/react'
import MenuItem from '../../MenuItem'

export interface SlashCommandItem {
  label: string
  description: string | React.ReactNode
  command: (props: { editor: Editor; range: Range }) => void
  icon?: React.ReactNode
}

interface Props {
  items: SlashCommandItem[]
  editor: Editor
  range: Range
}

const SlashCommandsList = ({ items, editor, range }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onKeyDown = (event: { key: string }) => {
    if (event.key === 'ArrowUp') {
      upHandler()
      return true
    }

    if (event.key === 'ArrowDown') {
      downHandler()
      return true
    }

    if (event.key === 'Enter') {
      enterHandler()
      return true
    }

    return false
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  const selectItem = (index: number) => {
    const item = items[index]

    if (item) {
      item.command({ editor, range })
    }
  }

  return (
    <Tippy>
      <MenuList onKeyDown={onKeyDown}>
        {items.map((item, index) => (
          <MenuItem
            onClick={() => selectItem(index)}
            label={''}
            key={index}
          ></MenuItem>
        ))}
      </MenuList>
    </Tippy>
  )
}

export default SlashCommandsList
