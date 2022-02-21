import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import supabase from '../../../supabase/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body,
    method,
    query: { id },
  } = req
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!id) {
    res.status(400).json({ error: 'No path UID!' })
    return
  }

  const uid = id as string

  if (method === 'GET') {
    const path = await prismaClient.path.findFirst({ where: { uid } })

    if (!path) {
      res.status(401).json({ error: 'Lesson not found!' })
      return
    }

    res.status(200).json(path)
  } else if (method === 'POST') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }

    const path = await prismaClient.path.upsert({
      where: { uid },
      create: { ...JSON.parse(body) },
      update: { ...JSON.parse(body) },
    })

    if (!path) {
      res.status(401).json({ error: 'Update failed!' })
      return
    }
    res.status(200).json(path)
  } else if (method === 'PUT') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }

    const path = await prismaClient.path.update({
      where: { uid },
      data: { ...JSON.parse(body) },
    })

    if (!path) {
      res.status(401).json({ error: 'Update failed!' })
      return
    }
    res.status(200).json(path)
  } else if (method === 'DELETE') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }
    const path = await prismaClient.path.findFirst({ where: { uid } })
    if (user.id !== path?.authorId) {
      res.status(403).json({ error: 'Forbiddden!' })
      return
    }
    await prismaClient.path.delete({ where: { uid } })
    res.status(200)
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
