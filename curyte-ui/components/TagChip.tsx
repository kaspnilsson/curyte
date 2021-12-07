import { Tag, TagLabel } from '@chakra-ui/tag'
import Link from 'next/link'
import React from 'react'
import { tagRoute, tagRouteHrefPath } from '../utils/routes'

interface Props {
  tagLabel: string
  colorScheme?: string
}

const TagChip = ({ tagLabel, colorScheme = 'purple' }: Props) => {
  return (
    <Link passHref href={tagRouteHrefPath} as={tagRoute(tagLabel)}>
      <Tag
        colorScheme={colorScheme}
        className="cursor-pointer hover:text-black"
      >
        <i className="ri-hashtag"></i>
        <TagLabel>{tagLabel}</TagLabel>
      </Tag>
    </Link>
  )
}
export default TagChip
