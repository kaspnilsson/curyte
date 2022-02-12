import { NextSeo } from 'next-seo'
import ErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import LessonHeader from '../../components/LessonHeader'
import FancyEditor from '../../components/FancyEditor'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useRouter } from 'next/router'
import {
  accountRoute,
  accountRouteHrefPath,
  editLessonRoute,
  lessonRoute,
  lessonRouteHrefPath,
  presentLessonRoute,
  workspaceRoute,
} from '../../utils/routes'
import { ParsedUrlQuery } from 'querystring'
import useCuryteEditor from '../../hooks/useCuryteEditor'
import LessonOutline from '../../components/LessonOutline'
import {
  logLessonView,
  deleteLesson,
  getLesson,
  getAuthor,
  setLessonFeatured,
  setLessonTemplate,
} from '../../firebase/api'
import { userIsAdmin } from '../../utils/hacks'
import { useToast } from '@chakra-ui/react'
import supabase from '../../supabase/client'

interface Props {
  lesson: Lesson
  author: Author
}

const PublishedLessonView = ({ lesson, author }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const user = supabase.auth.user()
  const toast = useToast()
  // Log views only on render of a published lesson
  useEffect(() => {
    if (lesson.private) return
    logLessonView(lesson.uid)
  }, [lesson.private, lesson.uid])

  const handleDelete = async () => {
    setLoading(true)
    await deleteLesson(lesson.uid)
    setLoading(false)
    router.push(workspaceRoute)
  }

  const editor = useCuryteEditor({ content: lesson.content }, [lesson])

  if (!lesson) return <ErrorPage statusCode={404} />

  const openGraphDescription = `${lesson.description}, tags:${[
    lesson.tags || [],
  ].join(', ')}`
  const openGraphImages = []
  if (lesson.coverImageUrl) {
    openGraphImages.push({ url: lesson.coverImageUrl })
  }

  const handleToggleFeatured = async () => {
    await setLessonFeatured(lesson.uid, !lesson.featured)
    toast({
      title: `Lesson featured state set to ${!lesson.featured}`,
    })
  }

  const handleToggleTemplate = async () => {
    await setLessonTemplate(lesson.uid, !lesson.template)
    toast({
      title: `Lesson template state set to ${!lesson.template}`,
    })
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <Layout
          title={lesson.title}
          rightContent={<LessonOutline editor={editor} />}
          breadcrumbs={[
            {
              label: author.displayName,
              href: accountRouteHrefPath,
              as: accountRoute(author.uid),
            },
            {
              label: lesson.title || '(no title)',
              href: lessonRouteHrefPath,
              as: lessonRoute(lesson.uid),
            },
          ]}
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
          <article>
            <LessonHeader
              author={author}
              lesson={lesson}
              handleDelete={
                user && user.id === lesson.authorId ? handleDelete : undefined
              }
              handleEdit={
                user && user.id === lesson.authorId
                  ? () => router.push(editLessonRoute(lesson.uid))
                  : undefined
              }
              handleToggleFeatured={
                user && userIsAdmin(user.id) ? handleToggleFeatured : undefined
              }
              handleToggleTemplate={
                user && userIsAdmin(user.id) ? handleToggleTemplate : undefined
              }
              handlePresent={() => router.push(presentLessonRoute(lesson.uid))}
            />
            <FancyEditor readOnly editor={editor} />
          </article>
        </Layout>
      )}
    </>
  )
}

interface IParams extends ParsedUrlQuery {
  id: string
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const lessons = await getLessons([where('private', '==', false)])
//   const paths = lessons.map(({ uid }) => ({
//     params: { id: uid },
//   }))
//   return { paths, fallback: 'blocking' }
// }

// export const getStaticProps: GetStaticProps = async (context) => {
//   const { id } = context.params as IParams
//   const lesson = await getLesson(id)
//   const author = await getAuthor(lesson.authorId)
//   return { props: { lesson, author } }
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as IParams
  const lesson = await getLesson(id)
  const author = await getAuthor(lesson.authorId)

  return { props: { lesson, author } }
}

export default PublishedLessonView
