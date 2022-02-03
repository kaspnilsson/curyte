/* eslint-disable @next/next/no-img-element */
import { Input } from '@chakra-ui/react'
import classNames from 'classnames'
import ImageAlignCenter from '../../icons/ImageAlignCenter'
import ImageAlignLeft from '../../icons/ImageAlignLeft'
import ImageAlignRight from '../../icons/ImageAlignRight'
import MenuIconButton from '../../MenuIconButton'
import { CuryteImageAttrs } from './CuryteImageAttrs'

interface EditorProps extends CuryteImageAttrs {
  onUpdate: (attrs: CuryteImageAttrs) => void
  selected: boolean
}

const CuryteImageEditorComponent = (props: EditorProps) => {
  const {
    src,
    displayMode = 'center',
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
          'w-full mx-auto float-none': displayMode === 'center',
          'max-w-[33%] float-left mr-4': displayMode === 'left',
          'max-w-[33%] float-right ml-4': displayMode === 'right',
        }
      )}
    >
      {selected && (
        <div className="absolute mx-auto top-4 flex items-center bg-white border !rounded-lg shadow-xl gap-1">
          <MenuIconButton
            label="Align image left"
            onClick={() => onUpdate({ ...props, displayMode: 'left' })}
            isActive={displayMode === 'left'}
            icon={<ImageAlignLeft />}
          />
          <MenuIconButton
            label="Align image center"
            onClick={() => onUpdate({ ...props, displayMode: 'center' })}
            isActive={displayMode === 'center'}
            icon={<ImageAlignCenter />}
          />
          <MenuIconButton
            label="Align image right"
            onClick={() => onUpdate({ ...props, displayMode: 'right' })}
            isActive={displayMode === 'right'}
            icon={<ImageAlignRight />}
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
      {displayMode === 'center' && (
        <Input
          placeholder="Add a caption..."
          variant="ghost"
          colorScheme="black"
          className="max-w-full mx-auto italic text-center bg-transparent text-zinc-700"
          value={caption}
          onChange={(e) => onUpdate({ ...props, caption: e.target.value })}
        ></Input>
      )}
    </div>
  )
}

export default CuryteImageEditorComponent
