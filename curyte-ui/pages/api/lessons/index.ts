import { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../../supabase/client'

export const getLessons = () => supabase.from('lessons').select('*')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') {
    const { data, error } = await getLessons()

    if (error) {
      res.status(401).json({ error })
    }

    res.status(200).json({ lessons: data })
    return
  }
}
