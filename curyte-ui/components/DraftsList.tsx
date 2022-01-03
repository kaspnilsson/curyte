import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState } from 'react'
import { Lesson } from '../interfaces/lesson'
import LoadingSpinner from './LoadingSpinner'
import { auth } from '../firebase/clientApp'
import { Tooltip, IconButton, useToast } from '@chakra-ui/react'
import { TrashIcon } from '@heroicons/react/outline'
import { where } from 'firebase/firestore'
import { deleteLesson, getLessons } from '../firebase/api'
import LessonLink from './LessonLink'

const DraftsList = () => {
  const toast = useToast()
  const [user, userLoading] = useAuthState(auth)
  const [drafts, setDrafts] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(userLoading)

  useEffect(() => {
    if (!user) return
    setLoading(true)

    getLessons([
      where('authorId', '==', user.uid),
      where('private', '==', true),
    ]).then((res) => {
      setLoading(false)
      setDrafts(res)
    })
  }, [user])

  const localDeleteDraft = async (uid: string) => {
    setLoading(true)
    try {
      await deleteLesson(uid)

      setDrafts(drafts.filter((d) => d.uid !== uid))
      toast({ title: 'Draft deleted!', status: 'success' })
    } catch (e) {
      toast({
        title: 'Failed to delete draft....',
        description: e as string,
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          {drafts.map((draft) => (
            <div className="flex items-center gap-1 mb-1 group" key={draft.uid}>
              <LessonLink lesson={draft} />
              <Tooltip label="Delete draft">
                <IconButton
                  aria-label="Delete draft"
                  variant="ghost"
                  className="invisible group-hover:visible"
                  title="Delete draft"
                  size="sm"
                  onClick={() => localDeleteDraft(draft.uid)}
                  icon={<TrashIcon className="w-5 h-5 text-zinc-900" />}
                />
              </Tooltip>
            </div>
          ))}
          {!drafts.length && 'No drafts!'}
        </>
      )}
    </>
  )
}

export default DraftsList
