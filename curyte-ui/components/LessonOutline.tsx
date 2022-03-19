import classNames from 'classnames'
import { List, ListItem } from '@chakra-ui/react'
import { Editor } from '@tiptap/react'
import { useCallback, useEffect, useState } from 'react'
import { types } from './extensions/AutoId'
import useActiveId from '../hooks/useActiveId'

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
  const activeId = useActiveId(
    items.map((i) => i.id),
    [items]
  )

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
        <div className="flex-col w-full truncate lex toc">
          <span className="mb-2 text-xs font-bold uppercase text-zinc-500">
            Outline
          </span>
          <List listStyleType="none">
            {items
              .filter((item) => !!item.text)
              .map((item, index) => (
                <a
                  href={`#${item.id}`}
                  key={index}
                  className={classNames(
                    'py-2 md:py-1 flex hover:text-zinc-900 rounded px-1 transition-colors',
                    {
                      'text-violet-700': activeId === item.id,
                      'text-zinc-500': activeId !== item.id,
                    }
                  )}
                >
                  <ListItem
                    className={classNames(
                      'truncate w-full text-sm text-inherit',
                      // Cannot use string concatenation to compute: https://v2.tailwindcss.com/docs/just-in-time-mode
                      {
                        'pl-0 font-bold text-sm 2xl:text-base leading-tight tracking-tighter':
                          item.level === minHeadingLevel,
                        'pl-3 font-semibold text-xs 2xl:text-sm leading-tight tracking-tighter':
                          item.level === minHeadingLevel + 1,
                        'pl-6 text-xs 2xl:text-sm leading-tight tracking-tighter':
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
