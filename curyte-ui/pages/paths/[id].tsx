import { NextSeo } from 'next-seo'
import ErrorPage from 'next/error'
import React, { useEffect } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import { pathRoute } from '../../utils/routes'
import { ParsedUrlQuery } from 'querystring'
import { logPathView, getAuthor, getPath, getLesson } from '../../firebase/api'
import { Badge, Center, Divider } from '@chakra-ui/react'
import { Path } from '../../interfaces/path'
import { title } from 'process'
import { computeClassesForTitle } from '../../components/LessonTitle'
import UnitOutline from '../../components/UnitOutline'
import AuthorLink from '../../components/AuthorLink'
import PathActions from '../../components/PathActions'
import DateFormatter from '../../components/DateFormatter'

interface Props {
  lessonsMap: { [uid: string]: Lesson }
  path: Path
  author: Author
}

const PublishedPathView = ({ lessonsMap, path, author }: Props) => {
  // Log views only on render of a published path
  useEffect(() => {
    if (path.private) return
    logPathView(path.uid)
  }, [path])

  if (!path) return <ErrorPage statusCode={404} />

  // const openGraphDescription = `${lesson.description}, tags:${[
  //   lesson.tags || [],
  // ].join(', ')}`
  // const openGraphImages = []
  // if (lesson.coverImageUrl) {
  //   openGraphImages.push({ url: lesson.coverImageUrl })
  // }

  // const handleToggleFeatured = async () => {
  //   await setLessonFeatured(lesson.uid, !lesson.featured)
  //   toast({
  //     title: `Lesson featured state set to ${!lesson.featured}`,
  //   })
  // }
  return (
    <Layout title={path.title}>
      <NextSeo
        title={path.title}
        // description={openGraphDescription}
        openGraph={{
          url: pathRoute(path.uid),
          title: path.title,
          // description: openGraphDescription,
          // images: openGraphImages,
          site_name: 'Curyte',
        }}
      ></NextSeo>
      <div className="flex">
        <div className="flex flex-col flex-grow gap-2 overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <div
              className={`${computeClassesForTitle(
                title
              )} font-bold flex-grow resize-none tracking-tighter leading-tight border-0 mb-4`}
            >
              {path.title || '(no title)'}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <AuthorLink author={author} />
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
                        <DateFormatter dateString={path.created} />
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
                        <DateFormatter dateString={path.updated} />
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
          {path.units?.map((u, index) => (
            <UnitOutline
              unit={u}
              key={index}
              unitIndex={index}
              lessonsMap={lessonsMap}
            />
          ))}
          {!path.units?.length && (
            <span className="text-zinc-700">(no units)</span>
          )}
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

  // TODO - fetch path and path lessons & authors to render cards
  const path = await getPath(id)
  const author = await getAuthor(path.authorId)
  const lessonIds = []
  for (const u of path.units || []) {
    lessonIds.push(...(u?.lessonIds || []))
  }
  const promises = []
  for (const uid of lessonIds) {
    promises.push(getLesson(uid))
  }
  const lessons = await Promise.all(promises)
  const lessonsMap: { [uid: string]: Lesson } = {}
  for (const l of lessons) {
    lessonsMap[l.uid] = l
  }
  return { props: { path, author, lessonsMap } }
}

export default PublishedPathView
