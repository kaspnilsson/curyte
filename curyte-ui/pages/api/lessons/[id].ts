import { NextApiRequest, NextApiResponse } from 'next'
import { Lesson } from '../../../interfaces/lesson'
import supabase from '../../../supabase/client'

export const getLesson = async (uid: string) =>
  supabase.from('lessons').select('*').eq('uid', uid)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req

  if (method === 'GET') {
    const { data, error } = await getLesson(id as string)

    if (error || !data?.length) {
      res.status(401).json({ error })
      return
    }

    res.status(200).json({ lesson: data[0] as Lesson })
  } else if (method === 'POST') {
    const { data, error } = await supabase
      .from('lessons')
      .upsert({ ...req.body })
    if (error) {
      res.status(401).json({ error })
      return
    }
    res.status(200).json({ lesson: data })
  }
}
