import { NextApiRequest, NextApiResponse } from 'next'
import { createApi } from 'unsplash-js'

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req

  const downloadLocation = (query.url as string) || ''
  await unsplashApi.photos.trackDownload({ downloadLocation })
  res.status(200).json({})
}
