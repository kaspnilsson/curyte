import firebase from '../../firebase/clientApp'
import Head from 'next/head'
import ErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import Container from '../../components/Container'
import LessonHeader from '../../components/LessonHeader'
import * as api from '../../firebase/api'
import FancyEditor from '../../components/FancyEditor'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

type Props = {
  lesson: Lesson
  author: Author
}

const PublishedLessonView = ({ lesson, author }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, userLoading] = useAuthState(firebase.auth())
  // Log views only on render of a published lesson
  useEffect(() => {
    api.logLessonView(lesson.uid)
  }, [lesson.uid])

  const handleDelete = async () => {
    setLoading(true)
    await api.deleteLesson(lesson.uid)
    setLoading(false)
    router.push('/')
  }

  if (!lesson || !lesson.title) return <ErrorPage statusCode={404} />

  return (
    <>
      {(loading || userLoading) && <LoadingSpinner />}
      {!(loading || userLoading) && (
        <Layout showProgressBar title={lesson.title}>
          <Container>
            <article className="mb-32">
              <Head>
                <title>{lesson.title}</title>
              </Head>
              <LessonHeader
                isDraft={false}
                author={author}
                lesson={lesson}
                handleDelete={
                  user && user.uid === lesson.authorId
                    ? handleDelete
                    : undefined
                }
              />
              <FancyEditor readOnly content={lesson.content} />
            </article>
          </Container>
        </Layout>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const lesson = await api.getLesson(query.id as string)

  const author = await api.getAuthor(lesson.authorId)

  return {
    props: { lesson, author },
  }
}

export default PublishedLessonView
