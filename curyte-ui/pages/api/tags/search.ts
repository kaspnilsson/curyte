// import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

const MAX_RESULTS = 20

// interface rawResults {
//   rank: number
//   tagText: string
// }

export const searchTags = async (q: string) => {
  // Index performing worse than just a regular sort
  // const queryStr = `
  //   select
  //       ts_rank(fts,websearch_to_tsquery('english', '${q as string}')) as rank,
  //       "tagText"
  //     from public.tags
  //     where
  //       fts @@ websearch_to_tsquery('english', '${q as string}')
  //     order by rank desc
  //     limit ${MAX_RESULTS};
  //     `
  // const idsRanked = await prismaClient.$queryRaw<rawResults[]>(
  //   Prisma.sql([queryStr])
  // )
  // const rankMap: { [key: string]: number } = {}
  // for (const result of idsRanked) {
  //   rankMap[result.tagText] = result.rank
  // }

  // const tags = await prismaClient.tag.findMany({
  //   where: { tagText: { in: Object.keys(rankMap) } },
  // })
  // tags.sort((a, b) => rankMap[b.tagText] - rankMap[a.tagText])
  const tags = await prismaClient.tag.findMany({
    where: { tagText: { contains: q, mode: 'insensitive' } },
    take: MAX_RESULTS,
  })
  return tags
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
    const tags = await searchTags(q as string)
    res.status(200).json(tags)
    return
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
