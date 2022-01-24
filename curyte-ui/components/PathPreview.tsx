import { Text, Center, Divider, Badge } from '@chakra-ui/react'
import { AcademicCapIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import Link from 'next/link'
import { Author } from '../interfaces/author'
import { Path } from '../interfaces/path'
import { pathRoute, pathRouteHrefPath } from '../utils/routes'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'

interface Props {
  path?: Path
  author?: Author
  onClick?: (p: Path) => void
}

const PathPreview = ({ path, author, onClick }: Props) => {
  if (!path) return null
  // return (
  //   <Link
  //     as={pathRoute(path.uid)}
  //     href={pathRouteHrefPath}
  //     passHref
  //     key={path.uid}
  //   >
  //     <Button
  //       variant="link"
  //       colorScheme="black"
  //       className="max-w-full min-w-0 overflow-hidden hover:bg-zinc-200 text-ellipsis whitespace-nowrap"
  //     >
  //       <span className="flex items-center w-auto min-w-0 p-1 m-0 overflow-hidden leading-tight tracking-tighter text-inherit whitespace-nowrap text-ellipsis">
  //         <AcademicCapIcon className="flex-shrink-0 w-5 h-5 mr-1" />
  //         <div className="overflow-hidden text-ellipsis whitespace-nowrap">
  //           {path.title || '(no title)'}
  //         </div>
  //       </span>
  //     </Button>
  //   </Link>
  // )

  const unitCount = (path.units || []).length
  const lessonCount = (path.units || []).reduce(
    (acc, curr) => (acc += curr.lessonIds?.length || 0),
    0
  )

  const card = (
    <div className="flex items-center w-full gap-3 cursor-pointer group lesson-preview">
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex flex-col gap-2">
          <Text className="text-base font-bold leading-tight tracking-tighter line-clamp-2 md:text-2xl">
            <a className="hover:underline group-hover:underline">
              {path.title || '(no title)'}
            </a>
          </Text>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          {author && <AuthorLink author={author} small />}
          {path.created && (
            <>
              <Center className="w-2 h-2">
                <Divider orientation="vertical" />
              </Center>
              <div className="text-zinc-500">
                <DateFormatter dateString={path.created} />
              </div>
            </>
          )}
          <div className="items-center hidden gap-2 md:flex">
            <Center className="w-2 h-2">
              <Divider orientation="vertical" />
            </Center>
            {/* <Text
              fontSize="xs"
              className="leading-tight tracking-tighter text-zinc-500 proportional-nums"
            >
              {path.saveCount || 0}
              &nbsp;{path.saveCount === 1 ? 'save' : 'saves'}
            </Text> 
            <Center className="w-2 h-2">
              <Divider orientation="vertical" />
            </Center> */}
            <Text
              fontSize="xs"
              className="leading-tight tracking-tighter text-zinc-500 proportional-nums"
            >
              {path.viewCount || 0}
              &nbsp;{path.viewCount === 1 ? 'view' : 'views'}
            </Text>
          </div>
        </div>
        {unitCount && lessonCount && (
          <Text className="mt-2 text-base font-bold">
            {`${lessonCount} lesson${
              lessonCount === 1 ? '' : 's'
            } across ${unitCount} unit${unitCount === 1 ? '' : 's'}`}
          </Text>
        )}
      </div>
      <div className="relative w-24 h-24 overflow-hidden rounded md:w-36 md:h-36 lg:w-64 border-[1px]">
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
                'radial-gradient(circle, rgba(255,255,255,1) 60%, rgba(113,113,122,1) 100%)',
            }}
          >
            <Image
              src="/static/curyte_logo_black.svg"
              layout="fill"
              objectFit="contain"
              alt={`Cover Image for ${path.title}`}
              className="image-wrapper"
            />
          </div>
        )}
        <div className="absolute flex flex-col items-end gap-1 bottom-2 right-2 h-min">
          {path.private && (
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
              <AcademicCapIcon className="w-4 h-4" />
            </div>
          </Badge>
        </div>
      </div>
    </div>
  )
  return (
    <>
      {!onClick && (
        <Link
          as={pathRoute(path.uid)}
          href={pathRouteHrefPath}
          passHref
          key={path.uid}
        >
          {card}
        </Link>
      )}
      {onClick && <div onClick={() => onClick(path)}>{card}</div>}
    </>
  )
}

export default PathPreview
