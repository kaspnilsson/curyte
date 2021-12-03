/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types'
import { googleDriveUrlMatchRegex } from './matchers'
import { EmbedProps } from './props'

const GoogleDriveEmbed = ({ attrs }: EmbedProps) => (
  <iframe
    className="rounded-xl shadow-lg border-2 border-gray-20 w-full h-96 my-8"
    title={`Google Drive Embed ${attrs.matches[1]}`}
    src={attrs.href.replace('/edit', '/preview')}
  />
)

export const GoogleDriveEmbedDescriptor: EmbedDescriptor = {
  title: 'Google Drive',
  keywords: 'google drive',
  icon: () => (
    <img
      alt="Google Drive Logo"
      src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png"
      width={24}
      height={24}
    />
  ),
  matcher: (url: string) => url.match(googleDriveUrlMatchRegex) || false,
  component: GoogleDriveEmbed,
}
