import { Prisma } from '@prisma/client'
import { User } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import { getUser } from '@supabase/supabase-auth-helpers/nextjs'

const MAX_RESULTS = 20

interface rawResults {
  rank: number
  uid: string
}

export const searchLessons = async (q: string, user: User | null) => {
  const queryStr = `
    select
        ts_rank(fts,websearch_to_tsquery('english', '${q as string}')) as rank,
        uid
      from public.lessons
      where 
        fts @@ websearch_to_tsquery('english', '${q as string}')
        and (private is false${
          user ? ` or (private is true and "authorId" = '${user.id}')` : ''
        })
      order by rank desc
      limit ${MAX_RESULTS};
      `

  const idsRanked = await prismaClient.$queryRaw<rawResults[]>(
    Prisma.sql([queryStr])
  )
  const rankMap: { [key: string]: number } = {}
  for (const result of idsRanked) {
    rankMap[result.uid] = result.rank
  }

  const lessons = await prismaClient.lesson.findMany({
    where: { uid: { in: Object.keys(rankMap) } },
    include: { profiles: true },
  })
  lessons.sort((a, b) => rankMap[b.uid] - rankMap[a.uid])
  return lessons
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = await getUser({ req, res })
  const {
    method,
    query: { q },
  } = req
  if (method === 'GET') {
    if (!q) {
      res.status(400)
      return
    }
    const lessons = await searchLessons(q as string, user)
    res.status(200).json(lessons)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
