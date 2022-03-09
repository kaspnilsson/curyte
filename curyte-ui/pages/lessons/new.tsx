import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { editLessonRoute, loginRoute } from '../../utils/routes'

import { Lesson } from '@prisma/client'
import { getLesson, createLesson } from '../../lib/apiHelpers'
import { useUser } from '../../contexts/user'

const NewLessonView = () => {
  const router = useRouter()
  const { userAndProfile } = useUser()
  const user = userAndProfile?.user

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
          created: new Date(),
          updated: new Date(),
        })
        router.replace(editLessonRoute(newLesson.uid))
      } else {
        const newLesson = await createLesson({
          private: true,
          authorId: user.id,
          created: new Date(),
          updated: new Date(),
        } as Lesson)
        router.replace(editLessonRoute(newLesson.uid))
      }
    }
    createNewDraft()
  }, [router, router.query.copyFrom, user])

  return <LoadingSpinner message="Building lesson..." />
}

export default NewLessonView
