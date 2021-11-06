/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types';
import { EmbedProps } from './props';
import { PresentationChartBarIcon } from '@heroicons/react/outline';

const urlMatchRegex = new RegExp(
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
);

export const IFrameEmbed = ({ attrs }: EmbedProps) => {
  return (
    <iframe
      className="rounded-xl shadow-lg border-none w-full h-96 my-8"
      title={`Embedded webpage`}
      src={attrs.href}
    />
  );
};

export const IFrameEmbedDescriptor: EmbedDescriptor = {
  title: 'Embed',
  keywords: 'web url webpage iframe link',
  icon: () => (
    <PresentationChartBarIcon
      style={{ color: 'inherit' }}
      className="h-5 w-5 opacity-80"
    />
  ),
  matcher: (url: string) => {
    return urlMatchRegex.test(url) || false;
  },
  component: IFrameEmbed,
};
