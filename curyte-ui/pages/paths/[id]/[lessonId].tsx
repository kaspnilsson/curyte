import { NextSeo } from 'next-seo'
import Head from 'next/head'
import ErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../../../components/Layout'
import LessonHeader from '../../../components/LessonHeader'
import FancyEditor from '../../../components/FancyEditor'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { useRouter } from 'next/router'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilIcon,
} from '@heroicons/react/outline'
import {
  accountRoute,
  accountRouteHrefPath,
  editLessonRoute,
  lessonInPathRoute,
  lessonInPathRouteHrefPath,
  lessonRoute,
  lessonRouteHrefPath,
  loginRoute,
  pathRoute,
  pathRouteHrefPath,
  presentLessonInPathRoute,
  workspaceRoute,
} from '../../../utils/routes'
import { ParsedUrlQuery } from 'querystring'
import useCuryteEditor from '../../../hooks/useCuryteEditor'
import LessonOutline from '../../../components/LessonOutline'
import { userIsAdmin } from '../../../utils/hacks'
import { Button, useToast, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { Lesson, Path } from '@prisma/client'
import { JSONContent } from '@tiptap/core'
import { deleteLesson, updateLesson, updatePath } from '../../../lib/apiHelpers'
import prismaClient from '../../../lib/prisma'
import { Unit } from '../../../interfaces/unit'
import { LessonWithProfile } from '../../../interfaces/lesson_with_profile'
import NotesList from '../../../components/NotesList'
import NotesEditor from '../../../components/NotesEditor'
import { useUserAndProfile } from '../../../contexts/user'

interface Props {
  lesson: LessonWithProfile
  path: Path
  nextLesson: Lesson | null
  prevLesson: Lesson | null
}

const LessonInPathView = ({
  lesson,
  path,
  nextLesson = null,
  prevLesson = null,
}: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { userAndProfile } = useUserAndProfile()
  const user = userAndProfile?.user
  const toast = useToast()

  // Log views only on render of a published lesson in published path
  useEffect(() => {
    if (lesson.private || path.private) return
    updateLesson(lesson.uid, {
      viewCount: { increment: 1 },
    })
    updatePath(path.uid, {
      viewCount: { increment: 1 },
    })
  }, [lesson.private, lesson.uid, path.private, path.uid])

  const handleDelete = async () => {
    setLoading(true)
    await deleteLesson(lesson.uid)
    setLoading(false)
    router.push(workspaceRoute)
  }

  const editor = useCuryteEditor(
    { content: lesson.content ? (lesson.content as JSONContent) : null },
    [lesson]
  )

  if (!lesson) return <ErrorPage statusCode={404} />

  const openGraphDescription = `${lesson.description}, tags:${[
    lesson.tags || [],
  ].join(', ')}`
  const openGraphImages = []
  if (lesson.coverImageUrl) {
    openGraphImages.push({ url: lesson.coverImageUrl })
  }

  const handleToggleFeatured = async () => {
    await updateLesson(lesson.uid, {
      featured: !lesson.featured,
    })
    toast({
      title: `Lesson featured state set to ${!lesson.featured}`,
    })
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <Layout
          rightContentWrapBehavior="reverse"
          title={lesson.title || ''}
          rightContent={
            <>
              <LessonOutline editor={editor} />
              {user && (
                <div className="hidden md:mt-4 md:flex">
                  <NotesEditor lessonId={lesson.uid} />
                </div>
              )}
              {!user && (
                <Link passHref href={loginRoute()}>
                  <Button
                    colorScheme="black"
                    className="flex items-center gap-2 mt-4"
                  >
                    <PencilIcon className="w-5 h-5" />
                    Notebook
                  </Button>
                </Link>
              )}
            </>
          }
          breadcrumbs={[
            {
              label:
                lesson.profiles.displayName ||
                lesson.profiles.publicEmail ||
                '(no name)',
              href: accountRouteHrefPath,
              as: accountRoute(lesson.profiles.uid || ''),
            },
            {
              label: path.title || '(no title)',
              href: pathRouteHrefPath,
              as: pathRoute(path.uid),
            },
            {
              label: lesson.title || '(no title)',
              href: lessonRouteHrefPath,
              as: lessonRoute(lesson.uid),
            },
          ]}
        >
          <NextSeo
            title={lesson.title || ''}
            description={openGraphDescription}
            openGraph={{
              url: lessonInPathRoute(path.uid, lesson.uid),
              title: lesson.title || '',
              description: openGraphDescription,
              images: openGraphImages,
              site_name: 'Curyte',
            }}
          ></NextSeo>
          <article>
            <Head>
              <title>{lesson.title || ''}</title>
            </Head>
            <LessonHeader
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
              handlePresent={() =>
                router.push(presentLessonInPathRoute(path.uid, lesson.uid))
              }
            />
            <FancyEditor readOnly editor={editor} />
            {user && (user.id === lesson.authorId || userIsAdmin(user.id)) && (
              <NotesList lessonId={lesson.uid} />
            )}
            <div className="flex items-center justify-between">
              {prevLesson && (
                <div className="flex flex-col items-start gap-2 mr-auto">
                  <Link
                    passHref
                    href={lessonInPathRouteHrefPath}
                    as={lessonInPathRoute(path.uid, prevLesson.uid)}
                  >
                    <Button className="flex items-center gap-2">
                      <ArrowLeftIcon className="w-4 h-4" />
                      Back
                    </Button>
                  </Link>
                  <Text
                    className="mr-2 break-all text-zinc-500 line-clamp-1"
                    fontSize="sm"
                  >
                    {prevLesson.title || '(no title)'}
                  </Text>
                </div>
              )}
              {!prevLesson && (
                <div className="flex flex-col items-start gap-2 mr-auto">
                  <Link
                    passHref
                    href={pathRouteHrefPath}
                    as={pathRoute(path.uid)}
                  >
                    <Button className="flex items-center gap-2">
                      <ArrowLeftIcon className="w-4 h-4" />
                      Back
                    </Button>
                  </Link>
                  <Text
                    className="mr-2 break-all text-zinc-500 line-clamp-1"
                    fontSize="sm"
                  >
                    Return to path
                  </Text>
                </div>
              )}
              {nextLesson && (
                <div className="flex flex-col items-end gap-2 ml-auto">
                  <Link
                    passHref
                    href={lessonInPathRouteHrefPath}
                    as={lessonInPathRoute(path.uid, nextLesson.uid)}
                  >
                    <Button
                      className="flex items-center gap-2"
                      colorScheme="black"
                    >
                      Next
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Text
                    className="ml-2 break-all text-zinc-500 line-clamp-1"
                    fontSize="sm"
                  >
                    {nextLesson.title || '(no title)'}
                  </Text>
                </div>
              )}
              {!nextLesson && (
                <div className="flex flex-col items-start gap-2 mr-auto">
                  <Link
                    passHref
                    href={pathRouteHrefPath}
                    as={pathRoute(path.uid)}
                  >
                    <Button
                      className="flex items-center gap-2"
                      colorScheme="black"
                    >
                      Next
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Text
                    className="mr-2 break-all text-zinc-500 line-clamp-1"
                    fontSize="sm"
                  >
                    Return to path
                  </Text>
                </div>
              )}
            </div>
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
  const { id, lessonId } = context.params as IParams

  const lesson = await prismaClient.lesson.findFirst({
    where: { uid: lessonId as string },
    include: { profiles: true },
  })
  const path = await prismaClient.path.findFirst({
    where: { uid: id as string },
    include: { profiles: true },
  })

  const flattened: string[] = ((path?.units || []) as unknown as Unit[]).reduce(
    (acc: string[], curr) => [...acc, ...(curr.lessonIds || [])],
    []
  )

  const index = flattened.findIndex((uid) => uid === lessonId)
  let nextLesson = null,
    prevLesson = null
  if (index !== -1) {
    nextLesson = flattened[index + 1]
      ? await prismaClient.lesson.findFirst({
          where: { uid: flattened[index + 1] },
          include: { profiles: true },
        })
      : null
    prevLesson = flattened[index - 1]
      ? await prismaClient.lesson.findFirst({
          where: { uid: flattened[index - 1] },
          include: { profiles: true },
        })
      : null
  }

  return { props: { lesson, path, nextLesson, prevLesson } }
}

export default LessonInPathView
