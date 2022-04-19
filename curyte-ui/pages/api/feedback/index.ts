import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import { getUser } from '@supabase/supabase-auth-helpers/nextjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { inResponseTo },
  } = req
  const { user } = await getUser({ req, res })

  if (!user) {
    res.status(403).end('Not logged in!')
    return
  }

  if (method === 'PUT') {
    // console.log(JSON.parse(body))
    const feedback = await prismaClient.feedback.upsert({
      where: {
        inResponseTo_userId: {
          inResponseTo: inResponseTo as string,
          userId: user.id as string,
        },
      },
      create: {
        content: JSON.parse(body),
        inResponseTo: inResponseTo as string,
        userId: user.id as string,
      },
      update: {
        content: JSON.parse(body),
        inResponseTo: inResponseTo as string,
        userId: user.id as string,
        updated: new Date(),
      },
    })
    res.status(200).json(feedback)
    return
  }
  if (method === 'GET') {
    if (!inResponseTo) {
      res.status(400).end('No lesson UID!')
      return
    }
    const feedback = await prismaClient.feedback.upsert({
      where: {
        inResponseTo_userId: {
          inResponseTo: inResponseTo as string,
          userId: user.id as string,
        },
      },
      create: { inResponseTo: inResponseTo as string, userId: user.id },
      update: {},
    })
    res.status(200).json(feedback)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
