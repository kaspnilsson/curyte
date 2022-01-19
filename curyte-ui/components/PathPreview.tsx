import { Button } from '@chakra-ui/react'
import { AcademicCapIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { Path } from '../interfaces/path'
import { pathRoute, pathRouteHrefPath } from '../utils/routes'

interface Props {
  path: Path
}

const PathPreview = ({ path }: Props) => {
  return (
    <Link
      as={pathRoute(path.uid)}
      href={pathRouteHrefPath}
      passHref
      key={path.uid}
    >
      <Button
        variant="link"
        colorScheme="black"
        className="max-w-full min-w-0 overflow-hidden hover:bg-zinc-200 text-ellipsis whitespace-nowrap"
      >
        <span className="flex items-center w-auto min-w-0 p-1 m-0 overflow-hidden leading-tight tracking-tighter text-inherit whitespace-nowrap text-ellipsis">
          <AcademicCapIcon className="flex-shrink-0 w-5 h-5 mr-1" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {path.title || '(no title)'}
          </div>
        </span>
      </Button>
    </Link>
  )
}

export default PathPreview
