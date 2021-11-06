/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types';
import { EmbedProps } from './props';
import { PresentationChartBarIcon } from '@heroicons/react/outline';
import { specialUrlMatchers, urlMatchRegex } from './matchers';

const IFrameEmbed = ({ attrs }: EmbedProps) => {
  debugger;
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
    for (const matcher of specialUrlMatchers) {
      debugger;
      if (matcher.test(url)) {
        debugger;
        return false;
      }
    }
    debugger;
    // Url matcher is very aggressive. Make sure it matches this URL and _none_ of the other URL matchers.
    return urlMatchRegex.test(url) || false;
  },
  component: IFrameEmbed,
};
