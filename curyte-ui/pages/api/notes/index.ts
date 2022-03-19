import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import { getUser } from '@supabase/supabase-auth-helpers/nextjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { lessonId },
  } = req
  const { user } = await getUser({ req, res })

  if (!user) {
    res.status(403).end('Not logged in!')
    return
  }

  if (method === 'PUT') {
    // console.log(JSON.parse(body))
    const notes = await prismaClient.notes.upsert({
      where: {
        userId_lessonId: {
          lessonId: lessonId as string,
          userId: user.id as string,
        },
      },
      create: {
        content: JSON.parse(body),
        lessonId: lessonId as string,
        userId: user.id as string,
      },
      update: {
        content: JSON.parse(body),
        lessonId: lessonId as string,
        userId: user.id as string,
      },
    })
    res.status(200).json(notes)
    return
  }
  if (method === 'GET') {
    if (!lessonId) {
      res.status(400).end('No lesson UID!')
      return
    }
    const notes = await prismaClient.notes.upsert({
      where: {
        userId_lessonId: {
          lessonId: lessonId as string,
          userId: user.id as string,
        },
      },
      create: { lessonId: lessonId as string, userId: user.id },
      update: {},
    })
    res.status(200).json(notes)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
