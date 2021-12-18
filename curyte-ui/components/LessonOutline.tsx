import classNames from 'classnames'
import { List, ListItem } from '@chakra-ui/react'
import { Editor } from '@tiptap/react'
import { useCallback, useEffect, useState } from 'react'
import { types } from './extensions/AutoId'

interface Props {
  editor: Editor | null
}

interface Heading {
  level: number
  id: string
  text: string
}

const LessonOutline = ({ editor }: Props) => {
  const [items, setItems] = useState<Heading[]>([])

  const handleUpdate = useCallback(() => {
    if (!editor) return
    const headings: Heading[] = []

    editor.state.doc.descendants((node) => {
      if (types.has(node.type.name) && node.attrs.id) {
        headings.push({
          level: node.attrs.level,
          text: node.textContent,
          id: node.attrs.id,
        })
      }
    })

    setItems(headings)
  }, [editor])

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

  let minHeadingLevel = 8
  for (const item of items) {
    minHeadingLevel = Math.min(minHeadingLevel, item.level)
  }

  return (
    <>
      {!items.length && null}
      {!!items.length && (
        <div className="toc flex flex-col mr-4 md:mt-10 truncate w-full">
          <span className="text-gray-500 tracking-tighter text-sm font-bold leading-tight py-2 px-2">
            OUTLINE
          </span>
          <List listStyleType="none">
            {items.map((item, index) => (
              <a
                href={`#${item.id}`}
                key={index}
                className="pl-2 py-2 md:py-1 flex hover:bg-purple-50 rounded"
              >
                <ListItem
                  className={classNames(
                    'font-semibold truncate text-lg md:text-base',
                    // Cannot use string concatenation to compute: https://v2.tailwindcss.com/docs/just-in-time-mode
                    {
                      'pl-0': item.level === minHeadingLevel,
                      'pl-4': item.level === minHeadingLevel + 1,
                      'pl-8': item.level === minHeadingLevel + 2,
                      'pl-12': item.level === minHeadingLevel + 3,
                      'pl-16': item.level === minHeadingLevel + 4,
                      'pl-20': item.level === minHeadingLevel + 5,
                    }
                  )}
                >
                  {item.text}
                </ListItem>
              </a>
            ))}
          </List>
        </div>
      )}
    </>
  )
}

export default LessonOutline
