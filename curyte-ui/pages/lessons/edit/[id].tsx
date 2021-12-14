import firebase from '../../../firebase/clientApp'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import EditLessonPage from '../../../components/EditLessonPage'
import { Author } from '../../../interfaces/author'
import { Lesson } from '../../../interfaces/lesson'
import { useRouter } from 'next/router'
import * as api from '../../../firebase/api'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { lessonRoute, loginRoute } from '../../../utils/routes'
import { GetServerSideProps } from 'next'

type Props = {
  id: string
}

const EditPublishedLessonView = ({ id }: Props) => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(firebase.auth())
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState<Lesson | undefined>()

  useEffect(() => {
    if (!user && !userLoading) router.push(loginRoute)
  })

  useEffect(() => {
    if (!user || userLoading) return
    const fetchLesson = async () => {
      setLesson(await api.getLesson(id))
      setLoading(false)
    }
    setLoading(true)
    fetchLesson()
  }, [id, user, userLoading])

  const handleSubmit = async (l: Lesson) => {
    const uid = await api.updateLesson(l)
    router.push(lessonRoute(uid))
  }

  return (
    <>
      {(userLoading || loading) && <LoadingSpinner />}
      {!loading && !userLoading && (
        <EditLessonPage
          lesson={lesson}
          user={user as unknown as Author}
          handleSubmit={handleSubmit}
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
