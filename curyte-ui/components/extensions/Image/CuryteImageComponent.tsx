/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames'
import { CuryteImageAttrs } from './CuryteImageAttrs'

const CuryteImageEditorComponent = ({
  src,
  displayMode = 'full',
  title = '',
  alt = '',
  caption = '',
}: CuryteImageAttrs) => {
  return (
    <div
      className={classNames(
        'h-min-content flex flex-col items-center gap-1 relative p-2 mx-auto',
        {
          'w-full': displayMode === 'full',
          'w-full md:max-w-[50%]': displayMode === 'half',
        }
      )}
    >
      <img
        src={src}
        alt={alt}
        title={title}
        className="m-0 border shadow-xl rounded-xl"
      ></img>
      {caption && (
        <span className="max-w-full mx-auto italic text-center bg-transparent text-zinc-700">
          {caption}
        </span>
      )}
    </div>
  )
}

export default CuryteImageEditorComponent
