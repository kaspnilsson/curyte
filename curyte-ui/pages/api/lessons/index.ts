import { NextApiRequest, NextApiResponse } from 'next'
import { LessonWithProfile } from '../../../interfaces/lesson_with_profile'
import prismaClient from '../../../lib/prisma'
import { deleteLessonContentServerside } from '../../../utils/hacks'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { withContent },
  } = req

  if (method === 'POST') {
    let lessons = await prismaClient.lesson.findMany({
      ...JSON.parse(body),
      include: { profiles: true },
    })
    if (!withContent) {
      lessons = deleteLessonContentServerside(lessons as LessonWithProfile[])
    }
    res.status(200).json(lessons)
    return
  }
  if (method === 'GET') {
    let lessons = await prismaClient.lesson.findMany({
      ...JSON.parse(body),
      include: { profiles: true },
    })
    if (!withContent) {
      lessons = deleteLessonContentServerside(lessons as LessonWithProfile[])
    }
    res.status(200).json(lessons)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
