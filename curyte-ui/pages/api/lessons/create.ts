import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import { getUser } from '@supabase/supabase-auth-helpers/nextjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = await getUser({ req, res })

  if (!user) {
    res.status(403).end('Forbidden')
    return
  }
  const {
    body,
    method,
    query: { copyFrom },
  } = req
  if (method === 'POST') {
    if (copyFrom) {
      const original = await prismaClient.lesson.findFirst({
        where: { uid: copyFrom as string },
      })

      if (!original) {
        res.status(404).end('Lesson to be copied from not found!')
        return
      }
      const data: Prisma.LessonUncheckedCreateInput = {
        coverImageUrl: original.coverImageUrl,
        parentLessonId: original.uid,
        authorId: user.id,
        title: original.title,
        tags: original.tags,
        description: original.description,
      }
      if (original.content) {
        data.content = original.content
      }
      const lesson = await prismaClient.lesson.create({
        data,
      })
      res.status(200).json(lesson)
      return
    } else {
      const lesson = await prismaClient.lesson.create(JSON.parse(body))
      res.status(200).json(lesson)
      return
    }
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
