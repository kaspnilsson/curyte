/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames'
import { CuryteImageAttrs } from './CuryteImageAttrs'

const CuryteImageEditorComponent = ({
  src,
  displayMode = 'center',
  title = '',
  alt = '',
  caption = 'DO NOT SUBMIT',
}: CuryteImageAttrs) => {
  return (
    <div
      className={classNames(
        'h-min-content not-prose flex flex-col items-center gap-1 relative p-2',
        {
          'lg:max-w-[50vw] mx-auto': displayMode === 'center',
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
