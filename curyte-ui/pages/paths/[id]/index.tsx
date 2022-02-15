import { NextSeo } from 'next-seo'
import ErrorPage from 'next/error'
import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../../../components/Layout'
import {
  accountRoute,
  accountRouteHrefPath,
  pathRoute,
  pathRouteHrefPath,
} from '../../../utils/routes'
import { ParsedUrlQuery } from 'querystring'
import { Badge, Center, Divider } from '@chakra-ui/react'
import { title } from 'process'
import { computeClassesForTitle } from '../../../components/LessonTitle'
import UnitOutline from '../../../components/UnitOutline'
import AuthorLink from '../../../components/AuthorLink'
import PathActions from '../../../components/PathActions'
import DateFormatter from '../../../components/DateFormatter'
import CoverImage from '../../../components/CoverImage'
import { Lesson } from '@prisma/client'
import { Unit } from '../../../interfaces/unit'
import { updatePath } from '../../../lib/apiHelpers'
import prismaClient from '../../../lib/prisma'
import { PathWithProfile } from '../../../interfaces/path_with_profile'
import { LessonWithProfile } from '../../../interfaces/lesson_with_profile'

interface Props {
  lessonsMap: { [uid: string]: LessonWithProfile }
  path: PathWithProfile
}

const PublishedPathView = ({ lessonsMap, path }: Props) => {
  // Log views only on render of a published path
  useEffect(() => {
    if (path.private) return
    updatePath(path.uid, {
      viewCount: { increment: 1 },
    })
  }, [path])

  if (!path) return <ErrorPage statusCode={404} />

  const openGraphImages = []
  if (path.coverImageUrl) {
    openGraphImages.push({ url: path.coverImageUrl })
  }

  const units = (path.units || []) as unknown as Unit[]

  // const handleToggleFeatured = async () => {
  //   await setLessonFeatured(lesson.uid, !lesson.featured)
  //   toast({
  //     title: `Lesson featured state set to ${!lesson.featured}`,
  //   })
  // }
  return (
    <Layout
      title={path.title || 'Curyte'}
      breadcrumbs={[
        {
          label:
            path.profiles.displayName ||
            path.profiles.publicEmail ||
            '(no name)',
          href: accountRouteHrefPath,
          as: accountRoute(path.profiles.uid || ''),
        },
        {
          label: path.title || '(no title)',
          href: pathRouteHrefPath,
          as: pathRoute(path.uid),
        },
      ]}
    >
      <NextSeo
        title={path.title || ''}
        description={path.title || ''}
        openGraph={{
          url: pathRoute(path.uid),
          title: path.title || '',
          description: path.title || '',
          images: openGraphImages,
          site_name: 'Curyte',
        }}
      ></NextSeo>
      <div className="flex">
        <div className="flex flex-col flex-grow gap-2">
          <div className="flex items-center justify-between w-full">
            <div
              className={`${computeClassesForTitle(
                title
              )} font-bold flex-grow resize-none tracking-tighter leading-tight border-0 mb-4`}
            >
              {path.title || '(no title)'}
            </div>
          </div>
          {path.coverImageUrl && (
            <div className="mb-8 sm:mx-0">
              <CoverImage
                title={path?.title || '(no title)'}
                src={path.coverImageUrl}
              />
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <AuthorLink author={path.profiles} />
            <div className="flex items-center gap-1">
              <div className="flex items-center mr-4">
                {path.private && (
                  <Badge
                    variant="subtle"
                    colorScheme="orange"
                    className="mr-4 h-min w-fit"
                  >
                    Private
                  </Badge>
                )}
                <div className="items-center hidden lg:flex">
                  {path.created && (
                    <>
                      <span className="flex gap-1 text-sm">
                        {path.updated &&
                          path.created !== path.updated &&
                          'Created'}
                        <DateFormatter date={path.created} />
                      </span>
                      <Center className="w-6 h-4">
                        <Divider orientation="vertical" />
                      </Center>
                    </>
                  )}
                  {path.updated && path.updated !== path.created && (
                    <>
                      <span className="flex gap-1 text-sm">
                        Updated
                        <DateFormatter date={path.updated} />
                      </span>
                      <Center className="w-6 h-4">
                        <Divider orientation="vertical" />
                      </Center>
                    </>
                  )}
                </div>
                <span className="text-sm">{`${
                  path.viewCount || 0
                } views`}</span>
              </div>
              <PathActions path={path} isReadOnlyView />
            </div>
          </div>
          {units.map((u, index) => (
            <UnitOutline
              unit={u}
              key={index}
              unitIndex={index}
              lessonsMap={lessonsMap}
              pathId={path.uid}
            />
          ))}
          {!units.length && <span className="text-zinc-700">(no units)</span>}
        </div>
      </div>
    </Layout>
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

  const props = {
    path: await prismaClient.path.findFirst({
      where: { uid: id as string },
      include: { profiles: true },
    }),
  } as Props

  const lessonIds = []
  for (const u of (props.path?.units || []) as unknown as Unit[]) {
    lessonIds.push(...(u?.lessonIds || []))
  }
  const lessons = await prismaClient.lesson.findMany({
    where: { uid: { in: lessonIds } },
    include: { profiles: true },
  })
  const lessonsMap: { [uid: string]: Lesson } = {}
  for (const l of lessons) {
    if (l) {
      lessonsMap[l.uid] = l
    } else {
      // Lesson not found, TODO
    }
  }
  return { props }
}

export default PublishedPathView
