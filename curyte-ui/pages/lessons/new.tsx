import firebase from '../../firebase/clientApp'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import EditLessonPage from '../../components/EditLessonPage'
import { Author } from '../../interfaces/author'
import { Lesson } from '../../interfaces/lesson'
import { useRouter } from 'next/router'
import * as api from '../../firebase/api'
import LoadingSpinner from '../../components/LoadingSpinner'

const NewLessonView = () => {
  const router = useRouter()
  const [user] = useAuthState(firebase.auth())
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState<Lesson | undefined>()

  useEffect(() => {
    if (router.query.copyFrom) {
      const fetchLesson = async () => {
        const l = await api.getLesson(router.query.copyFrom as string)
        setLesson({ ...l, parentLessonId: l.uid, uid: '' })
        setLoading(false)
      }
      setLoading(true)
      fetchLesson()
    } else {
      setLesson(undefined)
    }
  }, [router.query.copyFrom])

  const handleSubmit = async (l: Lesson) => {
    const uid = await api.publishLesson(l, l.uid)
    router.push(`/lessons/${uid}`)
  }
  const handleSaveDraft = async (l: Lesson) => {
    const uid = await api.createDraft(l)
    router.push(`/lessons/edit/${uid}`)
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <EditLessonPage
          lesson={lesson}
          user={user as unknown as Author}
          handleSubmit={handleSubmit}
          handleSaveDraft={handleSaveDraft}
        />
      )}
    </>
  )
}

export default NewLessonView
