/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types'
import { googleSlidesUrlMatchRegex } from './matchers'
import { EmbedProps } from './props'

const GoogleSlidesEmbed = ({ attrs }: EmbedProps) => (
  <iframe
    className="rounded-xl shadow-lg border-2 border-gray-20 w-full h-96 my-8"
    title={`GoogleSlides Embed ${attrs.matches[1]}`}
    src={attrs.href.replace('/edit', '/preview').replace('/pub', '/embed')}
  />
)

export const GoogleSlidesEmbedDescriptor: EmbedDescriptor = {
  title: 'Google Slides',
  keywords: 'google slides',
  icon: () => (
    <img
      alt="Google Slides Logo"
      src="http://assets.stickpng.com/thumbs/61447da25953a50004ee16df.png"
      width={24}
      height={24}
    />
  ),
  matcher: (url: string) => url.match(googleSlidesUrlMatchRegex) || false,
  component: GoogleSlidesEmbed,
}
