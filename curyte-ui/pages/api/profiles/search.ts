import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

const MAX_RESULTS = 20

interface rawResults {
  rank: number
  uid: string
}

export const searchProfiles = async (q: string) => {
  const queryStr = `
    select
        ts_rank(fts,websearch_to_tsquery('english', '${q as string}')) as rank,
        uid
      from public.profiles
      where 
        fts @@ websearch_to_tsquery('english', '${q as string}')
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

  const profiles = await prismaClient.profile.findMany({
    where: { uid: { in: Object.keys(rankMap) } },
  })
  profiles.sort((a, b) => rankMap[b.uid] - rankMap[a.uid])
  return profiles
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { q },
  } = req
  if (method === 'GET') {
    if (!q) {
      res.status(400)
      return
    }
    const profiles = await searchProfiles(q as string)
    res.status(200).json(profiles)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
