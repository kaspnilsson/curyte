import { auth } from '../../firebase/clientApp'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Lesson } from '../../interfaces/lesson'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { editLessonRoute, loginRoute } from '../../utils/routes'
import { getLesson, createLesson } from '../../firebase/api'

const NewLessonView = () => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      router.push(loginRoute(router.asPath))
      return
    }
    const fetchLesson = async () => {
      if (router.query.copyFrom) {
        const l = await getLesson(router.query.copyFrom as string)
        const newUid = await createLesson({
          ...l,
          parentLessonId: l.uid,
          private: true,
          authorId: user.uid,
          uid: '',
        })
        router.replace(editLessonRoute(newUid))
      } else {
        const newUid = await createLesson({
          private: true,
          authorId: user.uid,
        } as Lesson)
        router.replace(editLessonRoute(newUid))
      }
      setLoading(false)
    }
    setLoading(true)
    fetchLesson()
  }, [router, router.query.copyFrom, user, userLoading])

  return <>{(userLoading || loading) && <LoadingSpinner />}</>
}

export default NewLessonView
