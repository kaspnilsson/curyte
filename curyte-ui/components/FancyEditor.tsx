/* eslint-disable @next/next/no-img-element */
import Editor from 'rich-markdown-editor'
import 'github-markdown-css/github-markdown-light.css'
import { YoutubeEmbedDescriptor } from './embeds/YoutubeEmbed'
import { IFrameEmbedDescriptor } from './embeds/IFrameEmbed'
import { ImageEmbedDescriptor } from './embeds/ImageEmbed'
import { GoogleDocsEmbedDescriptor } from './embeds/GoogleDocsEmbed'
import { GoogleDrawingsEmbedDescriptor } from './embeds/GoogleDrawingsEmbed'
import { GoogleDriveEmbedDescriptor } from './embeds/GoogleDriveEmbed'
import { GoogleSlidesEmbedDescriptor } from './embeds/GoogleSlidesEmbed'
import { GoogleSheetsEmbedDescriptor } from './embeds/GoogleSheetsEmbed'

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
          GoogleDocsEmbedDescriptor,
          GoogleDrawingsEmbedDescriptor,
          GoogleDriveEmbedDescriptor,
          GoogleSlidesEmbedDescriptor,
          GoogleSheetsEmbedDescriptor,
          ImageEmbedDescriptor,
          IFrameEmbedDescriptor,
        ]}
      />
    </div>
  )
}

export default FancyEditor
