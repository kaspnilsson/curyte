/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { Author } from '../interfaces/author'
import { Image, Tag } from '@chakra-ui/react'
import React from 'react'

type Props = {
  author: Author
  className?: string
}

const AuthorLink = ({ author, className }: Props) => {
  return (
    <>
      {!author && null}
      {author && author.photoURL ? (
        <Image
          src={author.photoURL}
          borderRadius="full"
          className={'shadow-xl ' + className}
          alt={author.displayName}
        />
      ) : (
        <Tag
          borderRadius="full"
          size="lg"
          variant="solid"
          className={'shadow-xl ' + className}
        >
          {author.displayName
            ? author.displayName.substring(0, 2).toLocaleUpperCase()
            : '?'}
        </Tag>
      )}
    </>
  )
}

export default AuthorLink
