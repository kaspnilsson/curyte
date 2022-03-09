import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import supabaseAdmin from '../../../supabase/admin'

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
  const { user } = await supabaseAdmin.auth.api.getUserByCookie(req)

  if (!id) {
    res.status(400).json({ error: 'No lesson UID!' })
    return
  }

  const uid = id as string

  if (method === 'GET') {
    const lesson = await prismaClient.lesson.findFirst({
      where: { uid },
      include: { profiles: true },
    })

    if (!lesson) {
      res.status(401).json({ error: 'Lesson not found!' })
      return
    }

    // TODO if (!includeContent) lesson.content = null

    res.status(200).json(lesson)
  } else if (method === 'POST') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }

    const lesson = await prismaClient.lesson.upsert({
      where: { uid },
      create: { ...JSON.parse(body) },
      update: { ...JSON.parse(body) },
      include: { profiles: true },
    })

    if (!lesson) {
      res.status(401).json({ error: 'Update failed!' })
      return
    }
    // TODO if (!includeContent) lesson.content = null

    res.status(200).json(lesson)
  } else if (method === 'PUT') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }

    const lesson = await prismaClient.lesson.update({
      where: { uid },
      data: { ...JSON.parse(body) },
      include: { profiles: true },
    })

    if (!lesson) {
      res.status(401).json({ error: 'Update failed!' })
      return
    }
    // TODO if (!includeContent) lesson.content = null

    res.status(200).json(lesson)
  } else if (method === 'DELETE') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }
    const lesson = await prismaClient.lesson.findFirst({ where: { uid } })
    if (user.id !== lesson?.authorId) {
      res.status(403).json({ error: 'Forbiddden!' })
      return
    }
    await prismaClient.lesson.delete({ where: { uid } })
    res.status(200)
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
