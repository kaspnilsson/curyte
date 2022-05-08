import { Tag, TagLabel } from '@chakra-ui/tag'
import Link from 'next/link'
import React from 'react'
import { tagRoute, tagRouteHrefPath } from '../utils/routes'

interface Props {
  tagLabel: string
  colorScheme?: string
  size?: string
}

const TagChip = ({ tagLabel, colorScheme = 'zinc', size = 'sm' }: Props) => {
  return (
    <>
      {tagLabel && (
        <Link passHref href={tagRouteHrefPath} as={tagRoute(tagLabel)}>
          <a className="flex">
            <Tag
              size={size}
              colorScheme={colorScheme}
              className="cursor-pointer hover:text-black"
            >
              <TagLabel className="hover:underline">{tagLabel}</TagLabel>
            </Tag>
          </a>
        </Link>
      )}
      {!tagLabel && null}
    </>
  )
}
export default TagChip
