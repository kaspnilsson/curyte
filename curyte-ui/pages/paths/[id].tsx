import { NextSeo } from 'next-seo'
import { auth } from '../../firebase/clientApp'
import ErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import Container from '../../components/Container'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAuthState } from 'react-firebase-hooks/auth'
import { pathRoute } from '../../utils/routes'
import { ParsedUrlQuery } from 'querystring'
import { logPathView, getAuthor, getPath, getLessons } from '../../firebase/api'
import { Center, Divider, Heading } from '@chakra-ui/react'
import { where } from 'firebase/firestore'
import { Path } from '../../interfaces/path'
import { title } from 'process'
import { computeClassesForTitle } from '../../components/LessonTitle'
import UnitOutline from '../../components/UnitOutline'
import AuthorLink from '../../components/AuthorLink'

interface Props {
  lessonsMap: { [uid: string]: Lesson }
  path: Path
  author: Author
}

const PublishedPathView = ({ lessonsMap, path, author }: Props) => {
  const [loading] = useState(false)
  const [, userLoading] = useAuthState(auth)
  // Log views only on render of a published path
  useEffect(() => {
    if (!path.published) return
    logPathView(path.uid)
  }, [path])

  // const handleDelete = async () => {
  //   setLoading(true)
  //   await deleteLesson(lesson.uid)
  //   setLoading(false)
  //   router.push(lessonSearchRoute())
  // }

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
    <>
      {(loading || userLoading) && <LoadingSpinner />}
      {!(loading || userLoading) && (
        <Layout title={path.title} sidebar={<div></div>}>
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
          <Container className="px-5">
            <div className="flex">
              <div className="flex flex-col flex-grow gap-2 overflow-hidden">
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`${computeClassesForTitle(
                      title
                    )} font-bold flex-grow resize-none tracking-tighter leading-tight border-0 mx-4 mb-4`}
                  >
                    {path.title || '(no title)'}
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 mb-6">
                  <div className="flex items-center gap-2 text-sm md:text-base">
                    <AuthorLink author={author} />
                    {!!path.viewCount && (
                      <>
                        <Center className="w-6 h-4">
                          <Divider orientation="vertical" />
                        </Center>
                        {`${path.viewCount} views`}
                      </>
                    )}
                  </div>
                </div>
                <Heading
                  className="flex items-center justify-between mx-4 font-bold leading-tight tracking-tight"
                  fontSize="3xl"
                >
                  Units
                </Heading>
                {path.units?.map((u, index) => (
                  <UnitOutline
                    unit={u}
                    key={index}
                    unitIndex={index}
                    lessonsMap={lessonsMap}
                  />
                ))}
                {!path.units?.length && 'No units'}
              </div>
            </div>
          </Container>
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

  // TODO - fetch path and path lessons & authors to render cards
  const path = await getPath(id)
  const author = await getAuthor(path.authorId)
  const lessonIds = []
  for (const u of path.units || []) {
    lessonIds.push(...(u.lessonIds || []))
  }
  const lessons = await getLessons([where('uid', 'in', lessonIds)])
  const lessonsMap: { [uid: string]: Lesson } = {}
  for (const l of lessons) {
    lessonsMap[l.uid] = l
  }
  return { props: { path, author, lessonsMap } }
}

export default PublishedPathView
