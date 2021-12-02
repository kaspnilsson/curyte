/* eslint-disable @next/next/no-img-element */
import Editor from 'rich-markdown-editor'
import 'github-markdown-css/github-markdown-light.css'
import { YoutubeEmbedDescriptor } from './embeds/YoutubeEmbed'
import { IFrameEmbedDescriptor } from './embeds/IFrameEmbed'
import { ImageEmbedDescriptor } from './embeds/ImageEmbed'

interface Props {
  content: string
  onChange?: (getContent: () => string) => void
  readOnly?: boolean
}

const FancyEditor = ({ content, onChange, readOnly = false }: Props) => {
  return (
    <div className="markdown-body">
      <Editor
        value={content}
        onChange={onChange}
        readOnly={readOnly}
        embeds={[
          YoutubeEmbedDescriptor,
          ImageEmbedDescriptor,
          IFrameEmbedDescriptor,
        ]}
      />
    </div>
  )
}

export default FancyEditor
