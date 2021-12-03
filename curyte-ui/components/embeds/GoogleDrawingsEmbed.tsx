/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types'
import { googleDrawingsUrlMatchRegex } from './matchers'
import { EmbedProps } from './props'

const GoogleDrawingsEmbed = ({ attrs }: EmbedProps) => (
  <iframe
    className="rounded-xl shadow-lg border-2 border-gray-20 w-full h-96 my-8"
    title={`GoogleDocs Embed ${attrs.matches[1]}`}
    src={attrs.href.replace('/edit', '/preview')}
  />
)

export const GoogleDrawingsEmbedDescriptor: EmbedDescriptor = {
  title: 'Google Drawings',
  keywords: 'google drawings',
  icon: () => (
    <img
      alt="Google Docs Logo"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Drawings_2015_Logo.svg/1481px-Google_Drawings_2015_Logo.svg.png"
      width={24}
      height={24}
    />
  ),
  matcher: (url: string) => url.match(googleDrawingsUrlMatchRegex) || false,
  component: GoogleDrawingsEmbed,
}
