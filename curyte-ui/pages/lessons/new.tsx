import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { editLessonRoute, loginRoute } from '../../utils/routes'
import { Timestamp } from 'firebase/firestore'
import supabase from '../../supabase/client'
import { Lesson } from '@prisma/client'
import { getLesson, createLesson } from '../../lib/apiHelpers'

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
        const newLesson = await createLesson({
          ...l,
          parentLessonId: l.uid,
          private: true,
          authorId: user.id,
          uid: '',
          created: Timestamp.now().toDate(),
          updated: Timestamp.now().toDate(),
        })
        router.replace(editLessonRoute(newLesson.uid))
      } else {
        const newLesson = await createLesson({
          private: true,
          authorId: user.id,
          created: Timestamp.now().toDate(),
          updated: Timestamp.now().toDate(),
        } as Lesson)
        router.replace(editLessonRoute(newLesson.uid))
      }
    }
    createNewDraft()
  }, [router, router.query.copyFrom, user])

  return <LoadingSpinner message="Building lesson..." />
}

export default NewLessonView
