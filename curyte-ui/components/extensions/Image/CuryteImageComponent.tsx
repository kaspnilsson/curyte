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
      className={classNames('h-min-content not-prose', {
        'lg:max-w-[50vw] mx-auto': displayMode === 'center',
        'max-w-[33%] float-left mr-4': displayMode === 'left',
        'max-w-[33%] float-right ml-4': displayMode === 'right',
      })}
    >
      <img
        src={src}
        alt={alt}
        title={title}
        className="m-0 border shadow-xl rounded-xl"
      ></img>
      {caption && <span>{caption}</span>}
    </div>
  )
}

export default CuryteImageEditorComponent
