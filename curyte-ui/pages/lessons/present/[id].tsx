import React from 'react'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
// Import Swiper styles
import 'swiper/css'
import { lessonRouteHrefPath, lessonRoute } from '../../../utils/routes'
import PresentLessonView from '../../../components/PresentLessonView'
import prismaClient from '../../../lib/prisma'
import { LessonWithProfile } from '../../../interfaces/lesson_with_profile'

interface Props {
  lesson: LessonWithProfile
}

const PresentLesson = ({ lesson }: Props) => (
  <PresentLessonView
    lesson={lesson}
    backUrl={lessonRoute(lesson.uid)}
    backUrlHref={lessonRouteHrefPath}
  />
)

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
  const lesson = await prismaClient.lesson.findFirst({
    where: { uid: id },
    include: { profiles: true },
  })

  return { props: { lesson } }
}

export default PresentLesson
