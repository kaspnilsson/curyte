import firebase from '../../firebase/clientApp'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Lesson } from '../../interfaces/lesson'
import { useRouter } from 'next/router'
import * as api from '../../firebase/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import { draftRoute, loginRoute } from '../../utils/routes'

const NewLessonView = () => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(firebase.auth())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || userLoading) return
    if (!user && !userLoading) router.push(loginRoute)
    const fetchLesson = async () => {
      if (router.query.copyFrom) {
        const l = await api.getLesson(router.query.copyFrom as string)
        const newUid = await api.createDraft({
          ...l,
          parentLessonId: l.uid,
          uid: '',
        })
        router.replace(draftRoute(newUid))
      } else {
        const newUid = await api.createDraft({} as Lesson)
        router.replace(draftRoute(newUid))
      }
      setLoading(false)
    }
    setLoading(true)
    fetchLesson()
  }, [router, router.query.copyFrom, user, userLoading])

  return <>{(userLoading || loading) && <LoadingSpinner />}</>
}

export default NewLessonView
