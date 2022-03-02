import { NextApiRequest, NextApiResponse } from 'next'
import { createApi } from 'unsplash-js'
import { AttributedPhoto } from '../../../interfaces/attributed_photo'

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req

  const q = (query.q as string) || ''

  const data = (
    await unsplashApi.search.getPhotos({
      query: q,
      orientation: 'landscape',
      perPage: 9,
    })
  ).response?.results
  const photos = data?.map(
    (photo): AttributedPhoto => ({
      url: photo.urls.full,
      smallUrl: photo.urls.small,
      owner: photo.user.name || 'Unknown',
      unsplashUrl: photo.urls.raw,
      alt: photo.description || photo.alt_description || '',
      downloadUrl: photo.links.download_location,
    })
  )
  res.status(200).json(photos)
}
