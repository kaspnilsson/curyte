import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req
  if (method === 'POST') {
    const path = await prismaClient.path.create(JSON.parse(body))
    res.status(200).json(path)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
