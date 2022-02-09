import React from 'react'
import { Lesson } from '../../../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import { Author } from '../../../../interfaces/author'
import { ParsedUrlQuery } from 'querystring'
import { getLesson, getAuthor, getPath } from '../../../../firebase/api'
import {
  lessonInPathRoute,
  lessonInPathRouteHrefPath,
} from '../../../../utils/routes'
import PresentLessonView from '../../../../components/PresentLessonView'
import { Path } from '../../../../interfaces/path'

interface Props {
  lesson: Lesson
  author: Author
  path: Path
}

const PresentLesson = ({ lesson, author, path }: Props) => (
  <PresentLessonView
    lesson={lesson}
    author={author}
    backUrl={lessonInPathRoute(path.uid, lesson.uid)}
    backUrlHref={lessonInPathRouteHrefPath}
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
  const { id, lessonId } = context.params as IParams
  const lesson = await getLesson(lessonId as string)
  const author = await getAuthor(lesson.authorId)
  const path = await getPath(id as string)

  return { props: { lesson, author, path } }
}

export default PresentLesson
