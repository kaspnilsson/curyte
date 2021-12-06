import React, { useEffect, useState } from 'react'
import firebase from '../../firebase/clientApp'
import { GetServerSideProps } from 'next'
import { Author } from '../../interfaces/author'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import * as api from '../../firebase/api'
import EditLessonPage from '../../components/EditLessonPage'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Lesson } from '../../interfaces/lesson'
import { lessonRoute, loginRoute } from '../../utils/routes'

type Props = {
  id: string
}

const DraftView = ({ id }: Props) => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(firebase.auth())
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState<Lesson | undefined>()

  useEffect(() => {
    if (!user && !userLoading) {
      router.push(loginRoute)
    }
  })

  useEffect(() => {
    if (!user || userLoading) return
    const fetchDraft = async () => {
      setDraft(await api.getDraft(id))
      setLoading(false)
    }
    setLoading(true)
    fetchDraft()
  }, [id, user, userLoading])

  const handleSubmit = async (l: Lesson) => {
    const uid = await api.publishLesson(l, l.uid)
    router.push(lessonRoute(uid))
  }
  const handleSaveDraft = async (l: Lesson) => {
    await api.updateDraft(l)
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <EditLessonPage
          lesson={draft}
          user={user as unknown as Author}
          handleSubmit={handleSubmit}
          handleSaveDraft={handleSaveDraft}
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

export default DraftView
