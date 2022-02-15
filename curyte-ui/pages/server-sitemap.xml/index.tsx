/* eslint-disable @typescript-eslint/no-empty-function */
// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import { lessonRoute } from '../../utils/routes'
import { getLessons } from '../../lib/apiHelpers'

const makeAbsoluteUrl = (url: string) => `https://www.curyte.com${url}`

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const fields: ISitemapField[] = [
    {
      loc: 'https://www.curyte.com',
      lastmod: new Date().toISOString(),
      priority: 0.7,
      changefreq: 'weekly',
    },
  ]
  const lessons = await getLessons({ where: { private: { not: true } } })
  for (const lesson of lessons) {
    const loc = makeAbsoluteUrl(lessonRoute(lesson.uid))
    fields.push({
      loc,
      lastmod: new Date().toISOString(),
      priority: 0.7,
      changefreq: 'weekly',
    })
  }

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {}
