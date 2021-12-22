import { Tag, TagLabel } from '@chakra-ui/tag'
import Link from 'next/link'
import React from 'react'
import { tagRoute, tagRouteHrefPath } from '../utils/routes'

interface Props {
  tagLabel: string
  colorScheme?: string
}

const TagChip = ({ tagLabel, colorScheme = 'zinc' }: Props) => {
  return (
    <>
      {tagLabel && (
        <Link passHref href={tagRouteHrefPath} as={tagRoute(tagLabel)}>
          <Tag
            size="sm"
            colorScheme={colorScheme}
            className="cursor-pointer hover:text-black"
          >
            <i className="ri-hashtag"></i>
            <TagLabel className="hover:underline">{tagLabel}</TagLabel>
          </Tag>
        </Link>
      )}
      {!tagLabel && null}
    </>
  )
}
export default TagChip
