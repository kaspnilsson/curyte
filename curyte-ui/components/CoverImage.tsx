import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'

type Props = {
  title: string
  src: string
  lessonId?: string
}

const CoverImage = ({ title, lessonId, src }: Props) => {
  const image = (
    <div className="cover-image-wrapper w-full">
      <Image
        src={src}
        layout="fill"
        alt={`Cover Image for ${title}`}
        objectFit="contain"
        className="image"
      />
    </div>
  )

  return (
    <div className="mx-2 overflow-hidden rounded-xl shadow-xl relative w-full h-full max-h-[50vh] flex items-center">
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
