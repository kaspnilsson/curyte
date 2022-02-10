import React from 'react'
import { Lesson } from '../../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import { Author } from '../../../interfaces/author'
import { ParsedUrlQuery } from 'querystring'
import { getLesson, getAuthor } from '../../../firebase/api'
// Import Swiper styles
import 'swiper/css'
import { lessonRouteHrefPath, lessonRoute } from '../../../utils/routes'
import PresentLessonView from '../../../components/PresentLessonView'

interface Props {
  lesson: Lesson
  author: Author
}

const PresentLesson = ({ lesson, author }: Props) => (
  <PresentLessonView
    lesson={lesson}
    author={author}
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
  const lesson = await getLesson(id)
  const author = await getAuthor(lesson.authorId)

  return { props: { lesson, author } }
}

export default PresentLesson
