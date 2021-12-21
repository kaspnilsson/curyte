import { auth } from '../../../firebase/clientApp'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import EditLessonPage from '../../../components/EditLessonPage'
import { Author } from '../../../interfaces/author'
import { Lesson } from '../../../interfaces/lesson'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { lessonRoute, loginRoute } from '../../../utils/routes'
import { GetServerSideProps } from 'next'
import { useToast } from '@chakra-ui/react'
import { getLesson, updateLesson } from '../../../firebase/api'

type Props = {
  id: string
}

const EditPublishedLessonView = ({ id }: Props) => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState<Lesson | undefined>()
  const toast = useToast()

  useEffect(() => {
    if (!user || userLoading) return
    if (!user && !userLoading) router.push(loginRoute)
    toast({
      title: 'Edits made to published lessons will not be autosaved.',
      status: 'warning',
    })
    const fetchLesson = async () => {
      setLesson(await getLesson(id))
      setLoading(false)
    }
    setLoading(true)
    fetchLesson()
  }, [id, router, toast, user, userLoading])

  const handleSubmit = async () => {
    if (!lesson) return
    const uid = await updateLesson(lesson)
    router.push(lessonRoute(uid))
  }

  const handleUpdate = async (l: Lesson) => {
    if (loading || !l.uid) return
    setLesson(l)
  }
  return (
    <>
      {(userLoading || loading) && <LoadingSpinner />}
      {!loading && !userLoading && (
        <EditLessonPage
          lesson={lesson}
          user={user as unknown as Author}
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: { id: query.id as string },
  }
}

export default EditPublishedLessonView
