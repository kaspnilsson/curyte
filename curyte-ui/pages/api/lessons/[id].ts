import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import { getUser } from '@supabase/supabase-auth-helpers/nextjs'
import { userCanEditLesson } from '../../../server-utils/lesson-ownership'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body,
    method,
    // includeContent = false,
    query: { id },
  } = req
  const { user } = await getUser({ req, res })

  if (!id) {
    res.status(400).end('No lesson UID!')
    return
  }

  const uid = id as string

  if (method === 'GET') {
    const lesson = await prismaClient.lesson.findFirst({
      where: { uid },
      include: { profiles: true },
    })

    if (!lesson) {
      res.status(401).end('Lesson not found!')
      return
    }

    // TODO if (!includeContent) lesson.content = null

    res.status(200).json(lesson)
  } else if (method === 'POST') {
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }

    if (!(await userCanEditLesson(uid, user.id))) {
      res.status(403).end('You do not own this lesson!')
      return
    }

    const lesson = await prismaClient.lesson.update({
      where: { uid },
      data: JSON.parse(body),
      include: { profiles: true },
    })

    if (!lesson) {
      res.status(401).end('Update failed!')
      return
    }
    // TODO if (!includeContent) lesson.content = null

    res.status(200).json(lesson)
  } else if (method === 'PUT') {
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }

    const data = JSON.parse(body)

    if (!(await userCanEditLesson(uid, user.id))) {
      res.status(403).end('You do not own this lesson!')
      return
    }

    const lesson = await prismaClient.lesson.update({
      where: { uid },
      data,
      include: { profiles: true },
    })

    if (!lesson) {
      res.status(401).end('Update failed!')
      return
    }
    // TODO if (!includeContent) lesson.content = null

    res.status(200).json(lesson)
  } else if (method === 'DELETE') {
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }

    if (!(await userCanEditLesson(uid, user.id))) {
      res.status(403).end('You do not own this lesson!')
      return
    }

    // Delete things referencing this lesson first to not violate foriegn key constraints
    await prismaClient.notes.deleteMany({ where: { lessonId: uid } })
    await prismaClient.lesson.delete({ where: { uid } })
    res.status(200).end()
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
