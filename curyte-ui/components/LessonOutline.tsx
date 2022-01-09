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
  isActive: boolean
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
          isActive: false,
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
        <div className="flex flex-col w-full truncate toc md:mt-10">
          <span className="py-2 text-xs font-bold leading-tight tracking-tighter text-zinc-500 lg:text-sm">
            OUTLINE
          </span>
          <List listStyleType="none">
            {items.map((item, index) => (
              <a
                href={`#${item.id}`}
                key={index}
                className={classNames(
                  'py-2 md:py-1 flex text-zinc-500 hover:text-zinc-900 rounded',
                  { 'bg-zinc-500 text-white': item.isActive }
                )}
              >
                <ListItem
                  className={classNames(
                    'truncate w-full text-base',
                    // Cannot use string concatenation to compute: https://v2.tailwindcss.com/docs/just-in-time-mode
                    {
                      'pl-0 font-semibold 2xl:text-lg leading-tight tracking-tighter':
                        item.level === minHeadingLevel,
                      'pl-3 text-sm 2xl:text-base':
                        item.level === minHeadingLevel + 1,
                      'pl-6 text-sm 2xl:text-base':
                        item.level === minHeadingLevel + 2,
                    }
                  )}
                >
                  {item.text || <span className="italic">(no text)</span>}
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
