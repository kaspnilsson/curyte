import ErrorPage from 'next/error'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import EditLessonPage from '../../../components/EditLessonPage'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { debounce } from 'ts-debounce'

import { lessonRoute, loginRoute, workspaceRoute } from '../../../utils/routes'
import { Portal, useToast } from '@chakra-ui/react'
import { Confetti } from '../../../components/Confetti'
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { Lesson } from '@prisma/client'
import prismaClient from '../../../lib/prisma'
import { useUserAndProfile } from '../../../contexts/user'
import { updateLesson } from '../../../lib/apiHelpers'

interface Props {
  lesson?: Lesson
}

const LessonView = (props: Props) => {
  const router = useRouter()
  const toast = useToast()
  const [deleting, setDeleting] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [lesson, setLesson] = useState<Lesson | undefined>(props.lesson)
  const [isFiringConfetti, setIsFiringConfetti] = useState(false)
  const [savingPromise, setSavingPromise] = useState<Promise<unknown> | null>(
    null
  )
  const { userAndProfile, loading } = useUserAndProfile()

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
        try {
          const lessonPromise = updateLesson(l.uid, l)
          setSavingPromise(lessonPromise)
          await lessonPromise
          setLesson(l)
        } catch (e: unknown) {
          toast({
            status: 'error',
            title: 'Update failed',
            description: (e as Error).message,
          })
        } finally {
          setSavingPromise(null)
        }
      }, 500),
    [toast]
  )

  const handleUpdate = async (l: Lesson) => {
    if (deleting || !l.uid) return
    setDirty(true)
    await debouncedUpdateLesson(l)
    setDirty(false)
  }
  const handleDelete = async () => {
    if (!lesson) return
    setDeleting(true)
    await fetch(`/api/lessons/${lesson.uid}`, { method: 'DELETE' })
    setDeleting(false)
    router.push(workspaceRoute)
  }

  if (loading) return <LoadingSpinner />

  if (!lesson || !userAndProfile || !userAndProfile.profile) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <>
      {deleting && <LoadingSpinner />}
      {!deleting && (
        <>
          <EditLessonPage
            lesson={lesson}
            user={userAndProfile.profile}
            handleTogglePrivate={handleTogglePrivate}
            handleUpdate={handleUpdate}
            handlePreview={() => {
              router.push(lessonRoute(lesson.uid))
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

export const getServerSideProps = withPageAuth({
  redirectTo: loginRoute(),
  getServerSideProps: async ({ query }) => {
    const lesson = await prismaClient.lesson.findFirst({
      where: { uid: query.id as string },
    })

    return {
      props: { lesson },
    }
  },
})

export default LessonView
