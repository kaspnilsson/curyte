import { auth } from '../../firebase/clientApp'
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Lesson } from '../../interfaces/lesson'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { draftRoute, loginRoute } from '../../utils/routes'
import { getLesson, createDraft } from '../../firebase/api'

const NewLessonView = () => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      router.push(loginRoute(router.asPath))
      return
    }
    const createNewDraft = async () => {
      if (router.query.copyFrom) {
        const l = await getLesson(router.query.copyFrom as string)
        const newUid = await createDraft({
          ...l,
          parentLessonId: l.uid,
          uid: '',
        })
        router.replace(draftRoute(newUid))
      } else {
        const newUid = await createDraft({ authorId: user.uid } as Lesson)
        router.replace(draftRoute(newUid))
      }
    }
    createNewDraft()
  }, [router, router.query.copyFrom, user, userLoading])

  return <LoadingSpinner />
}

export default NewLessonView
