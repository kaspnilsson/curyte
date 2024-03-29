import React, { useEffect, useState } from 'react'
import { JSONContent } from '@tiptap/react'

import useCuryteEditor from '../hooks/useCuryteEditor'
import { Notes } from '@prisma/client'
import SimpleEditor from './SimpleEditor'
import { Spinner, Tooltip } from '@chakra-ui/react'
import { getNotes, updateNotes } from '../lib/apiHelpers'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { useUserAndProfile } from '../contexts/user'
import { useDebounceCallback } from '@react-hook/debounce'

interface Props {
  lessonId: string
}

const NotesEditor = ({ lessonId }: Props) => {
  const { userAndProfile } = useUserAndProfile()
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

  const handleContentUpdate = useDebounceCallback(
    async (content: JSONContent) => {
      setLoading(true)
      await updateNotes(lessonId, content)
      setLoading(false)
    },
    200
  )

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
    <div className="flex flex-col items-start w-full max-h-full">
      <div className="flex items-center w-full gap-3 p-3 shadow-lg rounded-t-xl bg-zinc-100">
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
      <div className="w-full min-h-0 overflow-y-auto shadow-lg rounded-b-xl bg-zinc-50">
        {/* <span className="text-xs text-zinc-500">
        Anything written here will be visible to the author of this lesson.
      </span> */}
        {editor && <SimpleEditor editor={editor} />}
      </div>
    </div>
  )
}

export default NotesEditor
