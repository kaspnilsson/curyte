import { NextSeo } from 'next-seo'
import { auth } from '../../firebase/clientApp'
import Head from 'next/head'
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
import { useAuthState } from 'react-firebase-hooks/auth'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
import {
  editLessonRoute,
  lessonRoute,
  lessonRouteHrefPath,
  lessonSearchRoute,
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
  getPath,
} from '../../firebase/api'
import { userIsAdmin } from '../../utils/hacks'
import { Button, useToast, Text } from '@chakra-ui/react'
import { Path } from '../../interfaces/path'
import Link from 'next/link'

interface Props {
  lesson: Lesson
  author: Author
  path: Path | null
  nextLesson: Lesson | null
  prevLesson: Lesson | null
}

const PublishedLessonView = ({
  lesson,
  author,
  nextLesson = null,
  prevLesson = null,
  path = null,
}: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, userLoading] = useAuthState(auth)
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
    router.push(lessonSearchRoute())
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
          <article className="mb-32">
            <Head>
              <title>{lesson.title}</title>
            </Head>
            <LessonHeader
              author={author}
              lesson={lesson}
              handleDelete={
                user && user.uid === lesson.authorId ? handleDelete : undefined
              }
              handleEdit={
                user && user.uid === lesson.authorId
                  ? () => router.push(editLessonRoute(lesson.uid))
                  : undefined
              }
              handleToggleFeatured={
                user && userIsAdmin(user.uid) ? handleToggleFeatured : undefined
              }
            />
            <FancyEditor readOnly editor={editor} />
          </article>
          {path && (nextLesson || prevLesson) && (
            <div className="flex items-center justify-between">
              {prevLesson && (
                <div className="flex flex-col items-start gap-2 mr-auto">
                  <Link
                    passHref
                    href={lessonRouteHrefPath}
                    as={lessonRoute(prevLesson.uid, path.uid)}
                  >
                    <Button className="flex items-center gap-2">
                      <ArrowLeftIcon className="w-5 h-5" />
                      Back
                    </Button>
                  </Link>
                  <Text
                    className="mr-2 text-zinc-500 line-clamp-1"
                    fontSize="sm"
                  >
                    {prevLesson.title || '(no title)'}
                  </Text>
                </div>
              )}
              {nextLesson && (
                <div className="flex flex-col items-end gap-2 ml-auto">
                  <Link
                    passHref
                    href={lessonRouteHrefPath}
                    as={lessonRoute(nextLesson.uid, path.uid)}
                  >
                    <Button
                      className="flex items-center gap-2"
                      colorScheme="black"
                    >
                      Next
                      <ArrowRightIcon className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Text
                    className="ml-2 text-zinc-500 line-clamp-1"
                    fontSize="sm"
                  >
                    {nextLesson.title || '(no title)'}
                  </Text>
                </div>
              )}
            </div>
          )}
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
  let path = null,
    nextLesson = null,
    prevLesson = null
  if (context.query.path) {
    path = await getPath(context.query.path as string)
    let flattened: string[] = []
    for (const u of path.units || []) {
      flattened = [...flattened, ...(u.lessonIds || [])]
    }

    const index = flattened.findIndex((uid) => uid === id)
    if (index !== -1) {
      nextLesson = flattened[index + 1]
        ? await getLesson(flattened[index + 1])
        : null
      prevLesson = flattened[index - 1]
        ? await getLesson(flattened[index - 1])
        : null
    }
  }

  return { props: { lesson, author, path, nextLesson, prevLesson } }
}

export default PublishedLessonView
