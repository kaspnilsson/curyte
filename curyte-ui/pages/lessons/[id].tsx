import Head from 'next/head'
import ErrorPage from 'next/error'
import React, { useEffect } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import Container from '../../components/Container'
import LessonHeader from '../../components/LessonHeader'
import * as api from '../../firebase/api'
import FancyEditor from '../../components/FancyEditor'

type Props = {
  lesson: Lesson
  author: Author
}

const PublishedLessonView = ({ lesson, author }: Props) => {
  // Log views only on render of a published lesson
  useEffect(() => {
    api.logLessonView(lesson.uid)
  }, [lesson.uid])

  if (!lesson || !lesson.title) return <ErrorPage statusCode={404} />

  return (
    <>
      <Layout showProgressBar title={lesson.title}>
        <Container>
          <article className="mb-32">
            <Head>
              <title>{lesson.title}</title>
            </Head>
            <LessonHeader isDraft={false} author={author} lesson={lesson} />
            <FancyEditor readOnly content={lesson.content} />
          </article>
        </Container>
      </Layout>
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
