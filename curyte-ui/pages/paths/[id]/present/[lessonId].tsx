import React from 'react'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import {
  lessonInPathRoute,
  lessonInPathRouteHrefPath,
} from '../../../../utils/routes'
import PresentLessonView from '../../../../components/PresentLessonView'
import { Path } from '@prisma/client'
import prismaClient from '../../../../lib/prisma'
import { LessonWithProfile } from '../../../../interfaces/lesson_with_profile'

interface Props {
  lesson: LessonWithProfile
  path: Path
}

const PresentLesson = ({ lesson, path }: Props) => (
  <PresentLessonView
    lesson={lesson}
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
  const lesson = await prismaClient.lesson.findFirst({
    where: { uid: lessonId as string },
    include: { profiles: true },
  })

  const author =
    lesson && lesson.authorId
      ? await prismaClient.profile.findFirst({
          where: { uid: lesson.authorId },
        })
      : null
  const path = await prismaClient.path.findFirst({
    where: { uid: id as string },
  })

  return { props: { lesson, author, path } }
}

export default PresentLesson
