import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Lesson } from '../../../interfaces/lesson'
import firebase from '../../../firebase/clientApp'
import { GetServerSideProps } from 'next'
import Layout from '../../../components/Layout'
import { Author } from '../../../interfaces/author'
import Container from '../../../components/Container'
import LessonHeader from '../../../components/LessonHeader'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../../components/LoadingSpinner'
import * as api from '../../../firebase/api'
import FancyEditor from '../../../components/FancyEditor'
import {
  draftRoute,
  lessonRoute,
  lessonSearchRoute,
  loginRoute,
} from '../../../utils/routes'
import useCuryteEditor from '../../../hooks/useCuryteEditor'
import LessonOutline from '../../../components/LessonOutline'

type Props = {
  id: string
}

const DraftPreviewView = ({ id }: Props) => {
  const [user, userLoading] = useAuthState(firebase.auth())
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [author, setAuthor] = useState({} as Author)
  const [draft, setDraft] = useState({} as Lesson)
  const router = useRouter()

  useEffect(() => {
    if (!user || userLoading) return
    const fetchLesson = async () => {
      const l = await api.getDraft(id)
      setDraft(l)
      setAuthor(await api.getAuthor(l.authorId))
      setLoading(false)
    }
    setLoading(true)
    fetchLesson()
  }, [id, user, userLoading])

  useEffect(() => {
    if (!user && !userLoading) {
      router.push(loginRoute)
    }
  })

  const handleDelete = async () => {
    setSaving(true)
    await api.deleteDraft(draft.uid)
    setSaving(false)
    router.push(lessonSearchRoute())
  }

  const handleEdit = () => {
    router.push(draftRoute(draft.uid))
  }

  const handlePublish = async () => {
    setSaving(true)
    const newUid = await api.publishLesson(draft, draft.uid)
    setSaving(false)
    router.push(lessonRoute(newUid))
  }
  const editor = useCuryteEditor({ content: draft.content }, [draft])

  return (
    <>
      {(loading || saving) && <LoadingSpinner />}
      {!loading && !saving && (
        <Layout
          showProgressBar
          title={draft.title}
          sidebar={<LessonOutline editor={editor} />}
        >
          <Container>
            <article className="mb-32">
              <Head>
                <title>{draft.title}</title>
              </Head>
              <LessonHeader
                isDraft
                author={author}
                lesson={draft}
                handleEdit={handleEdit}
                handleDelete={
                  user && user.uid === draft.authorId ? handleDelete : undefined
                }
                handlePublish={handlePublish}
              />
              <FancyEditor readOnly editor={editor} />
            </article>
          </Container>
        </Layout>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: { id: query.id as string },
  }
}

export default DraftPreviewView
