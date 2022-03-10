import { Spinner } from '@chakra-ui/react'
import { JSONContent } from '@tiptap/core'
import { useState, useEffect } from 'react'
import { useUser } from '../contexts/user'
import { NotesWithProfile } from '../interfaces/notes_with_profile'
import { queryNotesForLesson } from '../lib/apiHelpers'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import NotesRenderer from './NotesRenderer'

interface Props {
  lessonId: string
}

const NotesList = ({ lessonId }: Props) => {
  const { userAndProfile } = useUser()
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

  if (!userAndProfile?.user) return null
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-32">
        <Spinner size="xl" />
      </div>
    )
  }
  return (
    <div className="flex flex-col w-full pb-8 my-8">
      <div className="mb-4 text-2xl font-bold leading-tight tracking-tighter">
        Student notebooks
      </div>
      {!notes?.length && <div className="text-zinc-500">Nothing here yet!</div>}
      <div className="flex flex-wrap gap-4">
        {notes.map((n, index) => (
          <div key={index} className="w-80">
            <div className="flex items-center justify-between p-4 shadow-lg rounded-t-xl bg-zinc-100">
              <AuthorLink author={n.profiles} />
              <div className="text-sm text-zinc-700">
                <DateFormatter date={n.updated} />
              </div>
            </div>
            <div className="p-4 shadow-lg rounded-b-xl bg-zinc-50">
              <NotesRenderer
                content={n.content ? (n.content as JSONContent) : null}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotesList
