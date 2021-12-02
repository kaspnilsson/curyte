import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  title: string
  src: string
  slug?: string
}

const CoverImage = ({ title, src, slug }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/lessons/${slug}`} href="/lessons/[id]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
