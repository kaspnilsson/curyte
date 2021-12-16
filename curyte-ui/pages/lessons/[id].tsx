import { NextSeo } from 'next-seo'
import firebase from '../../firebase/clientApp'
import Head from 'next/head'
import ErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import Container from '../../components/Container'
import LessonHeader from '../../components/LessonHeader'
import * as api from '../../firebase/api'
import FancyEditor from '../../components/FancyEditor'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { editLessonRoute, lessonRoute } from '../../utils/routes'
import { ParsedUrlQuery } from 'querystring'
import useCuryteEditor from '../../hooks/useCuryteEditor'
import LessonOutline from '../../components/LessonOutline'

interface Props {
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

  const editor = useCuryteEditor({ content: lesson.content }, [lesson])

  if (!lesson || !lesson.title) return <ErrorPage statusCode={404} />

  const openGraphDescription = `${lesson.description}, tags:${lesson.tags.join(
    ', '
  )}`
  const openGraphImages = []
  if (lesson.coverImageUrl) {
    openGraphImages.push({ url: lesson.coverImageUrl })
  }
  return (
    <>
      {(loading || userLoading) && <LoadingSpinner />}
      {!(loading || userLoading) && (
        <Layout
          showProgressBar
          title={lesson.title}
          sidebar={<LessonOutline editor={editor} />}
        >
          <NextSeo
            title={lesson.title}
            description={openGraphDescription}
            openGraph={{
              url: lessonRoute(lesson.uid),
              title: lesson.title,
              description: openGraphDescription,
              images: openGraphImages,
              site_name: 'Curyte',
            }}
          ></NextSeo>
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
                handleEdit={
                  user && user.uid === lesson.authorId
                    ? () => router.push(editLessonRoute(lesson.uid))
                    : undefined
                }
              />
              <FancyEditor readOnly editor={editor} />
            </article>
          </Container>
        </Layout>
      )}
    </>
  )
}

interface IParams extends ParsedUrlQuery {
  id: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const lessons = await api.getLessons([])
  const paths = lessons.map(({ uid }) => ({
    params: { id: uid },
  }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams
  const lesson = await api.getLesson(id)
  const author = await api.getAuthor(lesson.authorId)
  return { props: { lesson, author } }
}

export default PublishedLessonView
