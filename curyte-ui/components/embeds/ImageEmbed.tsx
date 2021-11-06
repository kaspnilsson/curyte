/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types';
import { EmbedProps } from './props';
import { PhotographIcon } from '@heroicons/react/outline';
import Image from '@material-tailwind/react/Image';
import { imageUrlMatchRegex } from './matchers';

const ImageEmbed = ({ attrs }: EmbedProps) => {
  debugger;
  return (
    <Image
      className="max-w-full w-fit-content h-auto"
      raised
      alt="Embedded image"
      src={attrs.href}
    />
  );
};

export const ImageEmbedDescriptor: EmbedDescriptor = {
  title: 'Image from another site',
  keywords: 'image picture photo gif',
  icon: () => (
    <PhotographIcon
      style={{ color: 'inherit' }}
      className="h-5 w-5 opacity-80"
    />
  ),
  matcher: (url: string) => {
    debugger;
    return imageUrlMatchRegex.test(url) || false;
  },
  component: ImageEmbed,
};
