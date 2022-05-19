import { NextApiRequest, NextApiResponse } from 'next'

// Imports the Google Cloud client library
import { v2 } from '@google-cloud/translate'

// Instantiates a client
const translateClient = new v2.Translate({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  key: process.env.GOOGLE_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { q, lang },
  } = req

  if (!q || !lang) return
  const query = q as string
  const language = lang as string

  const translation = await translateClient.translate(query, language)

  res.status(200).json({ translation: translation[0] })
}
