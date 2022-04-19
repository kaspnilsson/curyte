import { Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useUserAndProfile } from '../contexts/user'
import { Notes } from '../interfaces/notes_with_profile'
import { queryNotesForLesson } from '../lib/apiHelpers'
import NotesRenderer from './NotesRenderer'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

interface Props {
  lessonId: string
}

const NotesList = ({ lessonId }: Props) => {
  const { userAndProfile } = useUserAndProfile()
  const [notes, setNotes] = useState<Notes[]>([])
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
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 900: 2, 1300: 3 }}>
        <Masonry gutter="1rem">
          {notes
            .filter((n) => !!n.content)
            .map((n, index) => (
              <NotesRenderer key={index} notes={n} />
            ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  )
}

export default NotesList
