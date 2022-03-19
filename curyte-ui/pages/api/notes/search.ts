import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { lessonId },
  } = req
  if (method === 'GET') {
    if (!lessonId) {
      res.status(400).end('No lesson UID!')
      return
    }
    // TODO: restrict this to the lesson owner
    const notes = await prismaClient.notes.findMany({
      where: { lessonId: lessonId as string },
      include: { profiles: true },
    })

    res.status(200).json(notes.filter((n) => !!n.content))
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
