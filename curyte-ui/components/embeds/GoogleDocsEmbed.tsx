/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types'
import { googleDocsUrlMatchRegex } from './matchers'
import { EmbedProps } from './props'

const GoogleDocsEmbed = ({ attrs }: EmbedProps) => (
  <iframe
    className="rounded-xl shadow-lg border-2 border-gray-20 w-full h-96 my-8"
    title={`Google Docs Embed ${attrs.matches[1]}`}
    src={attrs.href.replace('/edit', '/preview')}
  />
)

export const GoogleDocsEmbedDescriptor: EmbedDescriptor = {
  title: 'Google Docs',
  keywords: 'google docs',
  icon: () => (
    <img
      alt="Google Docs Logo"
      src="https://1000logos.net/wp-content/uploads/2020/05/Google-Docs-Logo-2012.png"
      width={24}
      height={24}
    />
  ),
  matcher: (url: string) => url.match(googleDocsUrlMatchRegex) || false,
  component: GoogleDocsEmbed,
}
