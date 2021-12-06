import { DocumentTextIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { Button } from '@chakra-ui/react'
import { Lesson } from '../interfaces/lesson'
import { draftRoute, draftRouteHrefPath } from '../utils/routes'

type Props = {
  draft: Lesson
}

const DraftLink = ({ draft }: Props) => {
  return (
    <Link
      as={draftRoute(draft.uid)}
      href={draftRouteHrefPath}
      passHref
      key={draft.uid}
    >
      <Button variant="link" colorScheme="black">
        <h3 className="text-xl leading-snug w-auto flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          {draft.title || '(no title)'}
        </h3>
      </Button>
    </Link>
  )
}
export default DraftLink
