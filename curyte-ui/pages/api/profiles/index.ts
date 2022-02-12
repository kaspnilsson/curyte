import { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../../supabase/client'

export const getAuthors = () => supabase.from('profiles').select('*')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') {
    const { data, error } = await getAuthors()

    if (error) {
      res.status(401).json({ error })
    }

    res.status(200).json({ authors: data })
    return
  }
}
