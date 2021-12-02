/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types'
import { EmbedProps } from './props'
import { PhotographIcon } from '@heroicons/react/outline'
import { Image } from '@chakra-ui/react'
import { imageUrlMatchRegex } from './matchers'

const ImageEmbed = ({ attrs }: EmbedProps) => (
  <Image
    className="w-full w-fit-content h-auto my-8 rounded-xl shadow-lg border-2 border-gray-200 "
    raised
    alt="Embedded image"
    src={attrs.href}
  />
)
export const ImageEmbedDescriptor: EmbedDescriptor = {
  title: 'Image from another site',
  keywords: 'image picture photo gif',
  icon: () => (
    <PhotographIcon
      style={{ color: 'inherit' }}
      className="h-5 w-5 opacity-80"
    />
  ),
  matcher: (url: string) => imageUrlMatchRegex.test(url) || false,
  component: ImageEmbed,
}
