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

  if (!id) {
    res.status(400).json({ error: 'No profile UID!' })
    return
  }

  const { user } = await supabase.auth.api.getUserByCookie(req)
  const uid = id as string

  if (method === 'GET') {
    const profile = await prismaClient.profile.findFirst({
      where: { uid },
    })

    if (!profile) {
      res.status(401).json({ error: 'Not found!' })
      return
    }
    res.status(200).json(profile)
  } else if (method === 'POST') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }
    const profile = await prismaClient.profile.upsert({
      where: { uid },
      create: { ...JSON.parse(body) },
      update: { ...JSON.parse(body) },
    })

    if (!profile) {
      res.status(401).json({ error: 'Update failed!' })
      return
    }
    res.status(200).json(profile)
  } else if (method === 'PUT') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }
    const profile = await prismaClient.profile.update({
      where: { uid },
      data: { ...JSON.parse(body) },
    })

    if (!profile) {
      res.status(401).json({ error: 'Update failed!' })
      return
    }
    res.status(200).json(profile)
  } else if (method === 'DELETE') {
    if (!user) {
      res.status(403).json({ error: 'Not logged in!' })
      return
    }
    if (uid !== user.id) {
      res.status(403).json({ error: 'Forbiddden!' })
      return
    }
    await prismaClient.lesson.delete({ where: { uid } })
    res.status(200)
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
