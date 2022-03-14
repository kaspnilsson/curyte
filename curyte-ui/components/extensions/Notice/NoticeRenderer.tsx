import { NodeViewWrapper, NodeViewContent, Editor } from '@tiptap/react'
import { NoticeAttrs } from './NoticeAttrs'
import { Color } from '../../../utils/color'
import classNames from 'classnames'
import ColorOptions from '../../ColorOptions'

export interface NoticeRendererProps {
  editor: Editor
  node: {
    attrs: NoticeAttrs
  }
  updateAttributes: (attr: NoticeAttrs) => void
}

const colorToEmoji = (color: Color) => {
  if (color === 'red') {
    return '🛑'
  }
  if (color === 'yellow') {
    return '⚠️'
  }
  if (color === 'green') {
    return '✅'
  }
  if (color === 'blue') {
    return 'ℹ️'
  }
  if (color === 'violet') {
    return 'ℹ️'
  }
  if (color === 'gray') {
    return '✏️'
  }
  return '✏️'
}

const NoticeWrapper = ({
  editor,
  node,
  updateAttributes,
}: NoticeRendererProps) => {
  const { backgroundColor = 'transparent' } = node.attrs
  const handleSetColor = (color: Color) => {
    updateAttributes({ ...node.attrs, backgroundColor: color })
  }

  return (
    <NodeViewWrapper>
      <div
        className={classNames(
          'border rounded-xl p-4 lg:p-8 my-4 items-center justify-center flex relative group',
          {
            'bg-red-50': backgroundColor === 'red',
            'bg-yellow-50': backgroundColor === 'yellow',
            'bg-green-50': backgroundColor === 'green',
            'bg-blue-50': backgroundColor === 'blue',
            'bg-violet-50': backgroundColor === 'violet',
            'bg-zinc-50': backgroundColor === 'gray',
            'bg-transparent': backgroundColor === 'transparent',
          }
        )}
      >
        {editor.isEditable && (
          <div className="absolute flex items-center invisible gap-1 mx-auto transition-all ease-in-out bg-white border rounded-lg shadow-lg opacity-0 -bottom-4 group-hover:visible group-hover:opacity-100">
            <ColorOptions
              onChange={handleSetColor}
              currentColor={backgroundColor}
            />
          </div>
        )}
        <div className="flex items-start justify-start w-full gap-4">
          <h2 className="!m-0 flex-0">{colorToEmoji(backgroundColor)}</h2>
          <NodeViewContent
            className={classNames('w-full col-start-2 flex-1 details-content', {
              '!text-red-900': backgroundColor === 'red',
              '!text-yellow-900': backgroundColor === 'yellow',
              '!text-green-900': backgroundColor === 'green',
              '!text-blue-900': backgroundColor === 'blue',
              '!text-violet-900': backgroundColor === 'violet',
              '!text-zinc-900':
                backgroundColor === 'gray' || backgroundColor === 'transparent',
            })}
          ></NodeViewContent>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default NoticeWrapper
