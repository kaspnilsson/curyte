import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { editLessonRoute, loginRoute } from '../../utils/routes'

import { Lesson } from '@prisma/client'
import { createLesson, copyLesson } from '../../lib/apiHelpers'
import { useUserAndProfile } from '../../contexts/user'

const NewLessonView = () => {
  const router = useRouter()
  const { userAndProfile, loading } = useUserAndProfile()
  const user = userAndProfile?.user

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push(loginRoute(router.asPath))
      return
    }
    const createNewDraft = async () => {
      if (router.query.copyFrom) {
        const l = await copyLesson(router.query.copyFrom as string)
        router.replace(editLessonRoute(l.uid))
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
  }, [loading, router, router.query.copyFrom, user])

  return <LoadingSpinner message="Building lesson..." />
}

export default NewLessonView
