import React, { useState, useEffect, useCallback } from 'react'
import { Editor, NodeViewWrapper } from '@tiptap/react'
import { ListItem, List } from '@chakra-ui/react'

interface Props {
  editor: Editor
}

interface Heading {
  level: number
  id: string
  text: string
}

const TOCComponent = ({ editor }: Props) => {
  const [items, setItems] = useState<Heading[]>([])
  const [minHeadingLevel, setMinHeadingLevel] = useState(8)

  const handleUpdate = useCallback(() => {
    const headings: Heading[] = []
    const transaction = editor.state.tr

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const id = `heading-${headings.length + 1}`

        if (node.attrs.id !== id) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id,
          })
        }

        setMinHeadingLevel(Math.min(node.attrs.level, minHeadingLevel))

        headings.push({
          level: node.attrs.level,
          text: node.textContent,
          id,
        })
      }
    })

    transaction.setMeta('preventUpdate', true)

    editor.view.dispatch(transaction)

    setItems(headings)
  }, [editor, minHeadingLevel])

  useEffect(handleUpdate, [handleUpdate])

  useEffect(() => {
    if (!editor) {
      return () => ({})
    }

    editor.on('update', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor, handleUpdate])

  return (
    <NodeViewWrapper className="toc rounded-xl border border-gray-200 p-2 bg-gray-50 flex flex-col">
      <span className="text-gray-500 tracking-tighter text-sm font-bold leading-tight py-2 px-3">
        LESSON CONTENT
      </span>
      <List listStyleType="none">
        {items.map((item, index) => (
          <a href={`#${item.id}`} key={index}>
            <ListItem
              className={`pl-${
                (item.level - minHeadingLevel + 1) * 3
              } hover:bg-gray-200 rounded py-1`}
            >
              {item.text}
            </ListItem>
          </a>
        ))}
      </List>
      {!items.length && (
        <span className="text-gray-500 font-light text-sm italic">
          Add headings to your lesson to expand your table of contents.
        </span>
      )}
    </NodeViewWrapper>
  )
}

export default TOCComponent
