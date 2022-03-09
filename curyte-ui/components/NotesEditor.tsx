import React, { useEffect, useState } from 'react'
import { JSONContent } from '@tiptap/react'

import { useDebounceCallback } from '@react-hook/debounce'
import useCuryteEditor from '../hooks/useCuryteEditor'
import { Notes } from '@prisma/client'
import SimpleEditor from './SimpleEditor'
import { Spinner, Tooltip } from '@chakra-ui/react'
import { getNotes, updateNotes } from '../lib/apiHelpers'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { useUser } from '../contexts/user'

interface Props {
  lessonId: string
}

const NotesEditor = ({ lessonId }: Props) => {
  const { userAndProfile } = useUser()
  const user = userAndProfile?.user
  const [notes, setNotes] = useState<Notes | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      if (!lessonId) return
      setLoading(true)
      const n = await getNotes(lessonId)
      if (n) {
        setNotes(n)
        setLoading(false)
      }
    }
    fetchNotes()
  }, [lessonId])

  const handleUpdate = async (content: JSONContent) => {
    setLoading(true)
    await updateNotes(lessonId, content)
    setLoading(false)
  }

  const handleContentUpdate = useDebounceCallback((json: JSONContent) => {
    handleUpdate(json)
  }, 100)

  const editor = useCuryteEditor(
    {
      content: notes?.content ? (notes.content as JSONContent) : null,
      onUpdate: handleContentUpdate,
      fancy: false,
    },
    [notes, handleContentUpdate]
  )

  if (!user) return null
  return (
    <div className="flex-col w-full mt-8">
      <div className="flex items-center gap-3">
        <Tooltip label="Notebook entries will be visible to the creator of the lesson.">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold uppercase text-zinc-700">
              NOTEBOOK
            </span>
            <InformationCircleIcon className="w-4 h-4 text-inherit" />
          </div>
        </Tooltip>
        {loading && <Spinner size="xs" />}
      </div>
      {/* <span className="text-xs text-zinc-500">
        Anything written here will be visible to the author of this lesson.
      </span> */}
      {editor && <SimpleEditor editor={editor} />}
    </div>
  )
}

export default NotesEditor
