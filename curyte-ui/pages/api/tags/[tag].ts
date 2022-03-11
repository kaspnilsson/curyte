import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import supabase from '../../../supabase/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { tag },
  } = req

  if (!tag) {
    res.status(400).end('No tag specified!')
    return
  }

  const tagText = tag as string

  if (method === 'GET') {
    const found = await prismaClient.tag.findFirst({
      where: { tagText },
    })

    found ? res.status(200).json(tag) : res.status(404)
    return
  } else if (method === 'POST') {
    const { user } = await supabase.auth.api.getUserByCookie(req)
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }

    const found = await prismaClient.tag.upsert({
      where: { tagText },
      create: { ...JSON.parse(body) },
      update: { ...JSON.parse(body) },
    })

    if (!found) {
      res.status(401).end('Update failed!')
      return
    }

    res.status(200).json(found)
  } else if (method === 'PUT') {
    const { user } = await supabase.auth.api.getUserByCookie(req)
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }

    const found = await prismaClient.tag.update({
      where: { tagText },
      data: { ...JSON.parse(body) },
    })

    if (!found) {
      res.status(401).end('Update failed!')
      return
    }

    res.status(200).json(found)
  } else if (method === 'DELETE') {
    const { user } = await supabase.auth.api.getUserByCookie(req)
    if (!user) {
      res.status(403).end('Not logged in!')
      return
    }
    await prismaClient.tag.delete({ where: { tagText } })
    res.status(200)
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
