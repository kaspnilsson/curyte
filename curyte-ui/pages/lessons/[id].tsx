import { NextSeo } from 'next-seo'
import ErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
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
import { userIsAdmin } from '../../utils/hacks'
import { useToast } from '@chakra-ui/react'
import { Profile } from '@prisma/client'
import prismaClient from '../../lib/prisma'
import { JSONContent } from '@tiptap/core'
import { deleteLesson, getLesson, updateLesson } from '../../lib/apiHelpers'
import { LessonWithProfile } from '../../interfaces/lesson_with_profile'
import NotesList from '../../components/NotesList'
import NotebookDrawerButton from '../../components/NotebookDrawerButton'
import { useUser } from '../../contexts/user'
import ShareLessonButton from '../../components/ShareLessonButton'

interface Props {
  lesson: LessonWithProfile | null
  author: Profile | null
}

const PublishedLessonView = (props: Props) => {
  const { author } = props
  const [lesson, setLesson] = useState(props.lesson)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { userAndProfile } = useUser()
  const user = userAndProfile?.user
  const toast = useToast()
  // Log views only on render of a published lesson
  useEffect(() => {
    if (!lesson || lesson.private) return
    updateLesson(lesson.uid, {
      viewCount: { increment: 1 },
    })
  }, [lesson])

  useEffect(() => {
    if (!lesson) return
    const fetchLesson = async () => {
      setLesson(await getLesson(lesson.uid))
    }

    fetchLesson()
    // Fetch lesson on load anyway to get updated view counts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async () => {
    if (!lesson) return
    setLoading(true)
    await deleteLesson(lesson.uid)
    setLoading(false)
    router.push(workspaceRoute)
  }

  const editor = useCuryteEditor(
    { content: lesson?.content ? (lesson.content as JSONContent) : null },
    [lesson]
  )

  if (!lesson || !author) return <ErrorPage statusCode={404} />

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

  const handleToggleTemplate = async () => {
    await updateLesson(lesson.uid, {
      template: !lesson.template,
    })
    toast({
      title: `Lesson template state set to ${!lesson.template}`,
    })
  }
  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <Layout
          title={lesson.title || ''}
          rightContent={<LessonOutline editor={editor} />}
          breadcrumbs={[
            {
              label: author.displayName || '(no name)',
              href: accountRouteHrefPath,
              as: accountRoute(author.uid),
            },
            {
              label: lesson.title || '(no title)',
              href: lessonRouteHrefPath,
              as: lessonRoute(lesson.uid),
            },
          ]}
          rightContentWrapBehavior="reverse"
        >
          <NextSeo
            title={lesson.title || ''}
            description={openGraphDescription}
            openGraph={{
              url: lessonRoute(lesson.uid),
              title: lesson.title || '',
              description: openGraphDescription,
              images: openGraphImages,
              site_name: 'Curyte',
            }}
            twitter={{
              cardType: 'summary_large_image',
              site: 'http://curyte.com',
              handle: '@curyte',
            }}
          ></NextSeo>
          <article>
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
              handleToggleTemplate={
                user && userIsAdmin(user.id) ? handleToggleTemplate : undefined
              }
              handlePresent={() => router.push(presentLessonRoute(lesson.uid))}
            />
            <FancyEditor readOnly editor={editor} />
            <div className="flex items-center justify-center w-full h-32 gap-8">
              <ShareLessonButton lesson={lesson} />
            </div>
            {user && (user.id === lesson.authorId || userIsAdmin(user.id)) && (
              <NotesList lessonId={lesson.uid} />
            )}
            {user && (
              <div className="fixed shadow-xl bottom-4 right-4">
                <NotebookDrawerButton lessonId={lesson.uid} />
              </div>
            )}
          </article>
        </Layout>
      )}
    </>
  )
}

interface IParams extends ParsedUrlQuery {
  id: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const lessons = await prismaClient.lesson.findMany({
    where: { private: { not: true } },
  })
  const paths = lessons.map(({ uid }) => ({
    params: { id: uid },
  }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams

  const props = {
    lesson: await prismaClient.lesson.findFirst({
      where: { uid: id },
      include: { profiles: true },
    }),
  } as Props
  if (props.lesson && props.lesson.authorId) {
    props.author = await prismaClient.profile.findFirst({
      where: { uid: props.lesson.authorId },
    })
  }
  return { props }
}

export default PublishedLessonView
