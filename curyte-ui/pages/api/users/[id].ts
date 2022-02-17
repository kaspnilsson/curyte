import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'
import supabase from '../../../supabase/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { id },
  } = req

  if (!id) {
    res.status(400).json({ error: 'No profile UID!' })
    return
  }

  const { user } = await supabase.auth.api.getUserByCookie(req)
  const uid = id as string

  if (method === 'DELETE') {
    if (!user || user.id !== uid) {
      res
        .status(403)
        .json({ error: "Not allowed to delete other peoples' content!" })
    }
    await prismaClient.profile.delete({
      where: { uid },
    })
    await prismaClient.lesson.deleteMany({
      where: { authorId: uid },
    })
    await prismaClient.path.deleteMany({
      where: { authorId: uid },
    })

    supabase.auth.signOut()
    res.status(200)
  } else {
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
