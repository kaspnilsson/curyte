/* eslint-disable @next/next/no-img-element */
import TextareaAutosize from 'react-textarea-autosize'
import classNames from 'classnames'
import ImageFullWidth from '../../icons/ImageFullWidth'
import ImageHalfWidth from '../../icons/ImageHalfWidth'
import MenuIconButton from '../../MenuIconButton'
import { CuryteImageAttrs } from './CuryteImageAttrs'

interface EditorProps extends CuryteImageAttrs {
  onUpdate: (attrs: CuryteImageAttrs) => void
  selected: boolean
}

const CuryteImageEditorComponent = (props: EditorProps) => {
  const {
    src,
    displayMode = 'full',
    onUpdate,
    title = '',
    alt = '',
    caption = '',
    selected,
  } = props
  return (
    <div
      className={classNames(
        'h-min-content flex flex-col items-center gap-1 relative p-2',
        {
          'w-full': displayMode === 'full',
          'max-w-[50%]': displayMode === 'half',
        }
      )}
    >
      {selected && (
        <div className="absolute mx-auto top-4 flex items-center bg-white border !rounded-lg shadow-xl gap-1">
          <MenuIconButton
            label="Full width"
            onClick={() => onUpdate({ ...props, displayMode: 'full' })}
            isActive={displayMode === 'full'}
            icon={<ImageFullWidth />}
          />
          <MenuIconButton
            label="Half width"
            onClick={() => onUpdate({ ...props, displayMode: 'half' })}
            isActive={displayMode === 'half'}
            icon={<ImageHalfWidth />}
          />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        title={title}
        className={classNames('!m-0 border not-prose shadow-xl rounded-xl', {
          'ring-4 ring-blue-500': selected,
        })}
      ></img>
      <TextareaAutosize
        placeholder="Add a caption..."
        className="w-full max-w-full p-4 mx-auto overflow-hidden text-base italic text-center bg-transparent border-0 rounded resize-none text-zinc-700 focus-within:bg-blue-50"
        value={caption}
        onChange={(e) => onUpdate({ ...props, caption: e.target.value })}
      />
    </div>
  )
}

export default CuryteImageEditorComponent
