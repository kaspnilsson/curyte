import { getUser } from '@supabase/supabase-auth-helpers/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req
  const { user } = await getUser({ req, res })
  if (!user) {
    res.status(403).end('Not logged in!')
    return
  }
  if (method === 'POST') {
    const profile = await prismaClient.profile.upsert({
      where: { uid: user.id },
      create: { ...JSON.parse(body) },
      update: { ...JSON.parse(body) },
    })
    res.status(200).json(profile)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
