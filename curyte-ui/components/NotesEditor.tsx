import React, { useEffect, useState } from 'react'
import { JSONContent } from '@tiptap/react'

import { useDebounceCallback } from '@react-hook/debounce'
import useCuryteEditor from '../hooks/useCuryteEditor'
import { Notes } from '@prisma/client'
import supabase from '../supabase/client'
import SimpleEditor from './SimpleEditor'
import { Heading, Spinner } from '@chakra-ui/react'
import { getNotes, updateNotes } from '../lib/apiHelpers'

interface Props {
  lessonId: string
}

const NotesEditor = ({ lessonId }: Props) => {
  const user = supabase.auth.user()
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
        <Heading className="uppercase text-zinc-700" size="xs">
          NOTEBOOK
        </Heading>
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
