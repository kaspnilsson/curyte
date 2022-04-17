/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://www.curyte.com',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.curyte.com/server-sitemap.xml', // <==== Add here
    ],
  },
}
