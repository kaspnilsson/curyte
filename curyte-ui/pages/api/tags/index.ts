import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req

  if (method === 'GET') {
    const tags = await prismaClient.tag.findMany(body)
    res.status(200).json({ tags })
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
