import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'

type Props = {
  title: string
  src: string
  lessonId?: string
  width?: number
  height?: number
}

const CoverImage = ({
  title,
  lessonId,
  src,
  width = 400,
  height = 200,
}: Props) => {
  const image = (
    <Image
      src={src}
      height={height}
      width={width}
      objectFit="cover"
      layout="responsive"
      alt={`Cover Image for ${title}`}
      className="image-wrapper w-fit-content h-auto"
    />
  )

  return (
    <div className="mx-2 h-fit-content w-fit-content overflow-hidden rounded-xl shadow-xl">
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
