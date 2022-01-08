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
        className="overflow-hidden rounded w-fit-content hover:bg-zinc-200"
      >
        <span className="flex items-center w-auto p-1 m-0 leading-tight tracking-tight text-inherit">
          <AcademicCapIcon className="w-5 h-5 mr-1" />
          {path.title || '(no title)'}
        </span>
      </Button>
    </Link>
  )
}

export default PathPreview
