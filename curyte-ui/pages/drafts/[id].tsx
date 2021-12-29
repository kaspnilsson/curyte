import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase/clientApp'
import { GetServerSideProps } from 'next'
import { Author } from '../../interfaces/author'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import EditLessonPage from '../../components/EditLessonPage'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Lesson } from '../../interfaces/lesson'
import { debounce } from 'ts-debounce'

import { lessonRoute, loginRoute, newLessonRoute } from '../../utils/routes'
import { getDraft, publishLesson, updateDraft } from '../../firebase/api'

type Props = {
  id: string
}

const DraftView = ({ id }: Props) => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Lesson | undefined>()
  const [savingPromise, setSavingPromise] = useState<Promise<void> | null>(null)

  useEffect(() => {
    if (!user && !userLoading) {
      router.push(loginRoute(router.asPath))
      return
    }
  })

  useEffect(() => {
    if (!user || userLoading) return
    const fetchDraft = async () => {
      const d = await getDraft(id)
      if (!d) {
        router.replace(newLessonRoute())
      }
      setDraft(d)
      setLoading(false)
    }
    setLoading(true)
    fetchDraft()
  }, [id, router, user, userLoading])

  const handleSubmit = async () => {
    if (savingPromise) await savingPromise
    if (!draft) return
    const uid = await publishLesson(draft, draft.uid)
    router.push(lessonRoute(uid))
  }

  const debouncedUpdateDraft = debounce(async (l: Lesson) => {
    const p = updateDraft(l)
    setSavingPromise(p)
    await p
    setDraft(l)
    setSavingPromise(null)
  }, 500)

  const handleUpdate = async (l: Lesson) => {
    if (loading || !l.uid) return
    if (savingPromise) await savingPromise
    await debouncedUpdateDraft(l)
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <EditLessonPage
          lesson={draft}
          user={user as unknown as Author}
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: { id: query.id as string },
  }
}

export default DraftView
