/* eslint-disable @next/next/no-img-element */
import { Textarea } from '@chakra-ui/react'
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
        'h-min-content flex flex-col items-center gap-1 relative p-2 mx-auto',
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
        className={classNames('!m-0 border not-prose rounded-xl', {
          'ring-4': selected,
        })}
      ></img>
      <Textarea
        placeholder="Add a caption..."
        variant="ghost"
        colorScheme="black"
        resize="none"
        className="max-w-full mx-auto italic text-center bg-transparent border-0 text-zinc-700 max-h-fit"
        value={caption}
        onChange={(e) => onUpdate({ ...props, caption: e.target.value })}
      ></Textarea>
    </div>
  )
}

export default CuryteImageEditorComponent
