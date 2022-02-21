import supabase from '../../supabase/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  supabase.auth.api.setAuthCookie(req, res)
}
