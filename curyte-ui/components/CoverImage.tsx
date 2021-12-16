import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'

type Props = {
  title: string
  src: string
  lessonId?: string
  isThumbnail?: boolean
}

const CoverImage = ({ title, lessonId, src, isThumbnail }: Props) => {
  const image = (
    <Image
      src={src}
      layout="fill"
      objectFit="cover"
      alt={`Cover Image for ${title}`}
      className="image-wrapper w-auto h-auto"
    />
  )

  return (
    <div
      className={classNames(
        'mx-2 overflow-hidden rounded-xl shadow-xl relative',
        { 'h-36 w-36': isThumbnail, 'h-96 w-full': !isThumbnail }
      )}
    >
      {lessonId ? (
        <Link as={lessonRoute(lessonId)} href={lessonRouteHrefPath}>
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
