import { auth } from '../../firebase/clientApp'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Lesson } from '../../interfaces/lesson'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { draftRoute, loginRoute } from '../../utils/routes'
import { getLesson, createDraft } from '../../firebase/api'

const NewLessonView = () => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      router.push(loginRoute)
      return
    }
    const fetchLesson = async () => {
      if (router.query.copyFrom) {
        const l = await getLesson(router.query.copyFrom as string)
        const newUid = await createDraft({
          ...l,
          parentLessonId: l.uid,
          uid: '',
        })
        router.replace(draftRoute(newUid))
      } else {
        const newUid = await createDraft({} as Lesson)
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
