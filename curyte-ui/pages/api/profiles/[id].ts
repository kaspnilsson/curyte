import { NextApiRequest, NextApiResponse } from 'next'
import { Author } from '../../../interfaces/author'
import supabase from '../../../supabase/client'

export const getAuthor = async (uid: string) =>
  supabase.from('profiles').select('*').eq('uid', uid)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req

  if (method === 'GET') {
    const { data, error } = await getAuthor(id as string)

    if (error || !data?.length) {
      res.status(401).json({ error })
      return
    }

    res.status(200).json({ author: data[0] as Author })
  } else if (method === 'POST') {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...req.body })
    if (error) {
      res.status(401).json({ error })
      return
    }
    res.status(200).json({ author: data })
  }
}
