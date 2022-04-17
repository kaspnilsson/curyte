import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { lessonId, pathId, tagText },
  } = req

  if (lessonId) {
    const lesson = await prismaClient.lesson.update({
      where: { uid: lessonId as string },
      data: { viewCount: { increment: 1 } },
    })
    if (!lesson) {
      res.status(401).end('Update failed!')
      return
    }
    res.status(200).end()
    return
  } else if (pathId) {
    const path = await prismaClient.path.update({
      where: { uid: pathId as string },
      data: { viewCount: { increment: 1 } },
    })
    if (!path) {
      res.status(401).end('Update failed!')
      return
    }
    res.status(200).end()
    return
  } else if (tagText) {
    const tag = await prismaClient.tag.update({
      where: { tagText: tagText as string },
      data: { viewCount: { increment: 1 } },
    })
    if (!tag) {
      res.status(401).end('Update failed!')
      return
    }
    res.status(200).end()
    return
  }
}
