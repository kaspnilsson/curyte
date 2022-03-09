import { Heading, Spinner } from '@chakra-ui/react'
import { JSONContent } from '@tiptap/core'
import { useState, useEffect } from 'react'
import { NotesWithProfile } from '../interfaces/notes_with_profile'
import { queryNotesForLesson } from '../lib/apiHelpers'
import supabase from '../supabase/client'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import NotesRenderer from './NotesRenderer'

interface Props {
  lessonId: string
}

const NotesList = ({ lessonId }: Props) => {
  const user = supabase.auth.user()
  const [notes, setNotes] = useState<NotesWithProfile[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      if (!lessonId) return
      setLoading(true)
      setNotes(await queryNotesForLesson(lessonId))
      setLoading(false)
    }
    fetchNotes()
  }, [lessonId])

  if (!user) return null
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-32">
        <Spinner size="xl" />
      </div>
    )
  }
  return (
    <div className="flex flex-col w-full">
      <Heading className="font-bold leading-tight tracking-tighter" size="md">
        Notes
      </Heading>
      {!notes?.length && (
        <div className="flex flex-col items-start gap-2 text-zinc-500">
          Nothing here yet!
        </div>
      )}
      <div className="flex flex-col gap-4 divide-y">
        {notes.map((n, index) => (
          <div key={index} className="w-full pt-8">
            <div className="flex items-center justify-between mb-4">
              <AuthorLink author={n.profiles} />
              <div className="text-sm text-zinc-700">
                <DateFormatter date={n.updated} />
              </div>
            </div>
            <NotesRenderer
              content={n.content ? (n.content as JSONContent) : null}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotesList
