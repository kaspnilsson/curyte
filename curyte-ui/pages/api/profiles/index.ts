import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req

  if (method === 'GET') {
    const profiles = await prismaClient.profile.findMany(body)
    res.status(200).json(profiles)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
