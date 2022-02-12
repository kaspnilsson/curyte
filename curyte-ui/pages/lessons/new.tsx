import React, { useEffect } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { editLessonRoute, loginRoute } from '../../utils/routes'
import { getLesson, createLesson } from '../../firebase/api'
import { Timestamp } from 'firebase/firestore'
import supabase from '../../supabase/client'

const NewLessonView = () => {
  const router = useRouter()
  const user = supabase.auth.user()

  useEffect(() => {
    if (!user) {
      router.push(loginRoute(router.asPath))
      return
    }
    const createNewDraft = async () => {
      if (router.query.copyFrom) {
        const l = await getLesson(router.query.copyFrom as string)
        const newUid = await createLesson({
          ...l,
          parentLessonId: l.uid,
          private: true,
          authorId: user.id,
          uid: '',
          created: Timestamp.now().toDate().toISOString(),
          updated: Timestamp.now().toDate().toISOString(),
        })
        router.replace(editLessonRoute(newUid))
      } else {
        const newUid = await createLesson({
          private: true,
          authorId: user.id,
          created: Timestamp.now().toDate().toISOString(),
          updated: Timestamp.now().toDate().toISOString(),
        } as Lesson)
        router.replace(editLessonRoute(newUid))
      }
    }
    createNewDraft()
  }, [router, router.query.copyFrom, user])

  return <LoadingSpinner message="Building lesson..." />
}

export default NewLessonView
