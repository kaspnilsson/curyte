/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types';
import { youtubeUrlMatchRegex } from './matchers';
import { EmbedProps } from './props';

const YoutubeEmbed = ({ attrs }: EmbedProps) => (
  <iframe
    className="rounded-xl shadow-lg border-2 border-gray-20 w-full h-96 my-8"
    title={`Youtube Embed ${attrs.matches[1]}`}
    src={`https://www.youtube.com/embed/${attrs.matches[1]}?modestbranding=1`}
  />
);

export const YoutubeEmbedDescriptor: EmbedDescriptor = {
  title: 'YouTube',
  keywords: 'youtube video tube google',
  icon: () => (
    <img
      alt="Youtube Logo"
      src="https://upload.wikimedia.org/wikipedia/commons/7/75/YouTube_social_white_squircle_%282017%29.svg"
      width={24}
      height={24}
    />
  ),
  matcher: (url: string) => url.match(youtubeUrlMatchRegex) || false,
  component: YoutubeEmbed,
};
