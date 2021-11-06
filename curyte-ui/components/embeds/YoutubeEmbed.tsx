/* eslint-disable @next/next/no-img-element */
import { EmbedDescriptor } from 'rich-markdown-editor/dist/types';
import { youtubeUrlMatchRegex } from './matchers';
import { EmbedProps } from './props';

const YoutubeEmbed = ({ attrs }: EmbedProps) => {
  const videoId = attrs.matches[1];

  return (
    <iframe
      className="rounded-xl shadow-lg border-none w-full h-96 my-8"
      title={`Youtube Embed ${videoId}`}
      src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
    />
  );
};

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
  matcher: (url: string) => {
    return url.match(youtubeUrlMatchRegex) || false;
  },
  component: YoutubeEmbed,
};
