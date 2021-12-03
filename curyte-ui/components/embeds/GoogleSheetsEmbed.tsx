/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types'
import { googleSheetsUrlMatchRegex } from './matchers'
import { EmbedProps } from './props'

const GoogleSheetsEmbed = ({ attrs }: EmbedProps) => (
  <iframe
    className="rounded-xl shadow-lg border-2 border-gray-20 w-full h-96 my-8"
    title={`Google Sheets Embed ${attrs.matches[1]}`}
    src={attrs.href.replace('/edit', '/preview')}
  />
)

export const GoogleSheetsEmbedDescriptor: EmbedDescriptor = {
  title: 'Google Sheets',
  keywords: 'google sheets',
  icon: () => (
    <img
      alt="Google Sheets Logo"
      src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/a8/b4bac6e9614670b5a201b62293c489/logo_sheets_2020q4_color_1x_web_512dp.png?auto=format%2Ccompress&dpr=1"
      width={24}
      height={24}
    />
  ),
  matcher: (url: string) => url.match(googleSheetsUrlMatchRegex) || false,
  component: GoogleSheetsEmbed,
}
