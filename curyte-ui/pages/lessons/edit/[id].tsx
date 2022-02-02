import React, { useEffect, useMemo, useState } from 'react'
import { auth } from '../../../firebase/clientApp'
import { GetServerSideProps } from 'next'
import { Author } from '../../../interfaces/author'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import EditLessonPage from '../../../components/EditLessonPage'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { Lesson } from '../../../interfaces/lesson'
import { debounce } from 'ts-debounce'

import {
  lessonRoute,
  loginRoute,
  newLessonRoute,
  workspaceRoute,
} from '../../../utils/routes'
import { deleteLesson, getLesson, updateLesson } from '../../../firebase/api'
import { Portal, useToast } from '@chakra-ui/react'
import { Confetti } from '../../../components/Confetti'

type Props = {
  id: string
}

const LessonView = ({ id }: Props) => {
  const router = useRouter()
  const toast = useToast()
  const [user, userLoading] = useAuthState(auth)
  const [loading, setLoading] = useState(true)
  const [dirty, setDirty] = useState(false)
  const [lesson, setLesson] = useState<Lesson | undefined>()
  const [isFiringConfetti, setIsFiringConfetti] = useState(false)
  const [savingPromise, setSavingPromise] = useState<Promise<unknown> | null>(
    null
  )

  useEffect(() => {
    if (!user && !userLoading) {
      router.push(loginRoute(router.asPath))
      return
    }
  })

  useEffect(() => {
    if (!user || userLoading) return
    const fetchLesson = async () => {
      const l = await getLesson(id)
      if (!l) {
        router.replace(newLessonRoute())
      }
      setLesson(l)
      setLoading(false)
    }
    setLoading(true)
    fetchLesson()
  }, [id, router, user, userLoading])

  const handleTogglePrivate = async () => {
    if (!lesson) return
    const l = { ...lesson, private: !lesson.private }
    await handleUpdate(l)

    if (l.private) {
      toast({
        title: 'Lesson set to private.',
      })
    } else {
      // celebrate!
      toast({ title: 'Lesson published!', status: 'success' })
      setIsFiringConfetti(true)
      setTimeout(() => setIsFiringConfetti(false), 300)
    }
  }

  const debouncedUpdateLesson = useMemo(
    () =>
      debounce(async (l: Lesson) => {
        const lessonPromise = updateLesson(l)
        setSavingPromise(lessonPromise)
        await lessonPromise
        setLesson(l)
        setSavingPromise(null)
      }, 500),
    []
  )

  const handleUpdate = async (l: Lesson) => {
    if (loading || !l.uid) return
    setDirty(true)
    await debouncedUpdateLesson(l)
    setDirty(false)
  }
  const handleDelete = async () => {
    if (!lesson) return
    setLoading(true)
    await deleteLesson(lesson.uid)
    setLoading(false)
    router.push(workspaceRoute)
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <EditLessonPage
            lesson={lesson}
            user={user as unknown as Author}
            handleTogglePrivate={handleTogglePrivate}
            handleUpdate={handleUpdate}
            handlePreview={() => {
              router.push(lessonRoute(id))
            }}
            handleDelete={handleDelete}
            saving={!!savingPromise}
            dirty={dirty}
          />
          <Portal>
            <Confetti isFiring={isFiringConfetti} />
          </Portal>
        </>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: { id: query.id as string },
  }
}

export default LessonView
