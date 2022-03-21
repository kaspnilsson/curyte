import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import { getUser } from '@supabase/supabase-auth-helpers/nextjs'
import { userCanEditPath } from '../../../server-utils/lesson-ownership'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body,
    method,
    query: { id },
  } = req
  const { user } = await getUser({ req, res })

  if (!id) {
    res.status(400).end('No path UID!')
    return
  }

  const uid = id as string

  if (method === 'GET') {
    const path = await prismaClient.path.findFirst({ where: { uid } })

    if (!path) {
      res.status(401).end('Lesson not found!')
      return
    }

    res.status(200).json(path)
  } else if (method === 'POST') {
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }

    if (!(await userCanEditPath(uid, user.id))) {
      res.status(403).end('You do not own this path!')
      return
    }

    const path = await prismaClient.path.update({
      where: { uid },
      data: { ...JSON.parse(body) },
    })

    if (!path) {
      res.status(401).end('Update failed!')
      return
    }
    res.status(200).json(path)
  } else if (method === 'PUT') {
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }

    if (!(await userCanEditPath(uid, user.id))) {
      res.status(403).end('You do not own this path!')
      return
    }

    const path = await prismaClient.path.update({
      where: { uid },
      data: { ...JSON.parse(body) },
    })

    if (!path) {
      res.status(401).end('Update failed!')
      return
    }
    res.status(200).json(path)
  } else if (method === 'DELETE') {
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }

    if (!(await userCanEditPath(uid, user.id))) {
      res.status(403).end('You do not own this path!')
      return
    }

    const path = await prismaClient.path.findFirst({ where: { uid } })
    if (user.id !== path?.authorId) {
      res.status(403).end('Forbiddden!')
      return
    }
    await prismaClient.path.delete({ where: { uid } })
    res.status(200)
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
