import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req
  if (method === 'POST') {
    const lessons = await prismaClient.lesson.findMany({
      ...JSON.parse(body),
      include: { profiles: true },
    })
    res.status(200).json(lessons)
    return
  }
  if (method === 'GET') {
    const lessons = await prismaClient.lesson.findMany({
      include: { profiles: true },
    })
    res.status(200).json(lessons)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
