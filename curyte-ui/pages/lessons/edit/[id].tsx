import ErrorPage from 'next/error'
import React from 'react'
import { LessonStorageModel } from '../../../interfaces/lesson'
import firebase from '../../../firebase/clientApp'
import { GetServerSideProps } from 'next'
import { Author } from '../../../interfaces/author'
import { useAuthState } from 'react-firebase-hooks/auth'
import EditLessonPage from '../../../components/EditLessonPage'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../../components/LoadingSpinner'
import * as api from '../../../firebase/api'

type Props = {
  lesson: LessonStorageModel
}

const EditLessonView = ({ lesson }: Props) => {
  const [user, loading] = useAuthState(firebase.auth())
  const router = useRouter()

  const handleSubmit = async (l: LessonStorageModel) => {
    if (!user) return
    let uid
    if (user.uid === l?.authorId) {
      // User owns this lesson
      uid = await api.updateLesson(l, l.uid)
      router.push(`/lessons/${uid}`)
    } else {
      // Logged in user is making a clone
      uid = await api.updateLesson({
        ...l,
        parentLessonId: l?.uid || '',
      })
    }
    router.push(`/lessons/${uid}`)
  }
  const handleSaveDraft = async (l: LessonStorageModel) => {
    if (!user) return
    let uid
    if (user.uid === l?.authorId) {
      // User owns this lesson
      uid = await api.updateLesson(l, l.uid)
      router.push(`/lessons/edit/${uid}`)
    } else {
      // Logged in user is making a clone
      uid = await api.updateLesson({
        ...l,
        parentLessonId: l?.uid || '',
      })
    }
    router.push(`/lessons/edit/${uid}`)
  }

  if (loading) return <LoadingSpinner />
  if (!lesson || !lesson.title || !user) return <ErrorPage statusCode={404} />
  return (
    <EditLessonPage
      lesson={lesson}
      user={user as unknown as Author}
      handleSubmit={handleSubmit}
      handleSaveDraft={handleSaveDraft}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const lesson = await api.getLesson(query.id as string)

  return {
    props: { lesson },
  }
}

export default EditLessonView
