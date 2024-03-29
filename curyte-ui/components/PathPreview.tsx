import { Text, Badge } from '@chakra-ui/react'
import { AcademicCapIcon, DocumentTextIcon } from '@heroicons/react/outline'
import { Path, Profile } from '@prisma/client'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { Unit } from '../interfaces/unit'

import {
  editPathRoute,
  editPathRouteHrefPath,
  pathRoute,
  pathRouteHrefPath,
} from '../utils/routes'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'

interface Props {
  path?: Path
  author?: Profile | null
  onClick?: (p: Path) => void
  small?: boolean
}

const PathPreview = ({ path, author, onClick, small = false }: Props) => {
  if (!path) return null

  const units = (path.units || []) as unknown as Unit[]
  const unitCount = units.length
  const lessonCount = units.reduce(
    (acc, curr) => (acc += curr.lessonIds?.length || 0),
    0
  )

  const card = (
    <div className="grid grid-cols-[1fr_min-content] w-full gap-3 cursor-pointer group lesson-preview py-6">
      <div className="flex flex-col flex-1 h-full gap-1">
        <div className="flex flex-col gap-2">
          <Text
            className={classNames(
              'text-base font-bold leading-tight tracking-tighter line-clamp-2',
              { 'md:text-2xl': !small }
            )}
          >
            <a className="hover:underline group-hover:underline">
              {path.title || '(no title)'}
            </a>
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs divide-x">
          {author && <AuthorLink author={author} small />}
          {path.created && (
            <div className="pl-2 text-zinc-500">
              <DateFormatter date={path.created} />
            </div>
          )}
          {/* <Text
              fontSize="xs"
              className="leading-tight tracking-tighter text-zinc-500 proportional-nums"
            >
              {path.saveCount || 0}
              &nbsp;{path.saveCount === 1 ? 'save' : 'saves'}
            </Text>  */}
          <Text
            fontSize="xs"
            className="pl-2 leading-tight tracking-tighter text-zinc-500 proportional-nums"
          >
            {path.viewCount || 0}
            &nbsp;{path.viewCount === 1 ? 'view' : 'views'}
          </Text>
        </div>
        <Text
          className={classNames('flex items-center gap-1 mt-2 font-semibold', {
            'text-base': !small,
            'text-sm': small,
          })}
        >
          <DocumentTextIcon className="w-5 h-5" />
          {(unitCount &&
            lessonCount &&
            `${lessonCount} lesson${
              lessonCount === 1 ? '' : 's'
            } across ${unitCount} unit${unitCount === 1 ? '' : 's'}`) ||
            '(no units)'}
        </Text>
      </div>
      {!small && (
        <div className="relative w-32 h-32 overflow-hidden border rounded md:w-40 md:h-40 xl:w-72">
          {path.coverImageUrl && (
            <Image
              src={path.coverImageUrl}
              layout="fill"
              objectFit="cover"
              alt={`Cover Image for ${path.title}`}
              className="image-wrapper"
            />
          )}
          {!path.coverImageUrl && (
            <div
              className="w-full h-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,1) 20%, rgba(200,200,200,1) 100%)',
              }}
            >
              <AcademicCapIcon className="w-full h-full p-6" />
            </div>
          )}
          <div className="absolute flex flex-col items-end gap-1 bottom-2 right-2 h-min">
            {!!path.private && (
              <Badge
                variant="subtle"
                colorScheme="orange"
                className="h-min w-min"
              >
                Private
              </Badge>
            )}
            <Badge variant="subtle" colorScheme="zinc" className="h-min w-min">
              <div className="flex items-center gap-1">
                Path
                <AcademicCapIcon className="w-3 h-3" />
              </div>
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
  return (
    <>
      {!onClick && (
        <>
          {!path.private && (
            <Link
              as={pathRoute(path.uid)}
              href={pathRouteHrefPath}
              passHref
              key={path.uid}
            >
              {card}
            </Link>
          )}
          {path.private && (
            <Link
              as={editPathRoute(path.uid)}
              href={editPathRouteHrefPath}
              passHref
              key={path.uid}
            >
              {card}
            </Link>
          )}
        </>
      )}
      {onClick && (
        <div className="w-full" onClick={() => onClick(path)}>
          {card}
        </div>
      )}
    </>
  )
}

export default PathPreview
