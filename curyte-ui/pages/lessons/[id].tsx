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
  loginRoute,
  presentLessonRoute,
  workspaceRoute,
} from '../../utils/routes'
import { ParsedUrlQuery } from 'querystring'
import useCuryteEditor from '../../hooks/useCuryteEditor'
import LessonOutline from '../../components/LessonOutline'
import { userIsAdmin } from '../../utils/hacks'
import { Button, useToast } from '@chakra-ui/react'
import { Profile } from '@prisma/client'
import prismaClient from '../../lib/prisma'
import { JSONContent } from '@tiptap/core'
import {
  deleteLesson,
  getLesson,
  logLessonView,
  updateLesson,
} from '../../lib/apiHelpers'
import { LessonWithProfile } from '../../interfaces/lesson_with_profile'
import NotesEditor from '../../components/NotesEditor'
import NotesList from '../../components/NotesList'
import NotebookDrawerButton from '../../components/NotebookDrawerButton'
import { useUserAndProfile } from '../../contexts/user'
import ShareLessonButton from '../../components/ShareLessonButton'
import { PencilIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { isServerSideRendering } from '../../hooks/useWindowSize'

interface Props {
  lesson: LessonWithProfile | null
  author: Profile | null
}

const PublishedLessonView = (props: Props) => {
  const { author } = props
  const [lesson, setLesson] = useState(props.lesson)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { userAndProfile } = useUserAndProfile()
  const user = userAndProfile?.user
  const toast = useToast()
  // Log views only on render of a published lesson
  useEffect(() => {
    if (!lesson || lesson.private) return
    logLessonView(lesson.uid)
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
  console.log(lesson?.content)

  const openGraphDescription = `${lesson.description}, tags:${[
    lesson.tags || [],
  ].join(', ')}`
  const openGraphImages = []
  if (lesson.coverImageUrl) {
    openGraphImages.push({ url: lesson.coverImageUrl })
  }

  const handleToggleFeatured = async () => {
    setLesson(
      await updateLesson(lesson.uid, {
        featured: !lesson.featured,
      })
    )
    toast({
      title: `Lesson featured state set to ${!lesson.featured}`,
    })
  }

  const handleToggleTemplate = async () => {
    setLesson(
      await updateLesson(lesson.uid, {
        template: !lesson.template,
      })
    )
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
          rightContent={
            <>
              <LessonOutline editor={editor} />
              {user && (
                <div className="hidden md:mt-4 md:flex">
                  <NotesEditor lessonId={lesson.uid} />
                </div>
              )}
              {!user && (
                <Link
                  passHref
                  href={loginRoute(isServerSideRendering ? '' : router.asPath)}
                >
                  <a>
                    <Button
                      colorScheme="black"
                      className="flex items-center gap-2 mt-4"
                    >
                      <PencilIcon className="w-5 h-5" />
                      Notebook
                    </Button>
                  </a>
                </Link>
              )}
            </>
          }
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
              <div className="fixed shadow-xl md:hidden bottom-4 right-4">
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
