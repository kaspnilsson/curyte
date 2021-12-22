/* eslint-disable @next/next/no-img-element */
import { Author } from '../interfaces/author'
import { Image, Tag } from '@chakra-ui/react'
import React from 'react'

type Props = {
  author: Author
  className?: string
}

const Avatar = ({ author, className }: Props) => {
  return (
    <>
      {!author && null}
      {author && author.photoURL ? (
        <Image
          src={author.photoURL}
          borderRadius="full"
          className={'shadow-xl shadow-zinc-900/10 ' + className}
          alt={author.displayName}
        />
      ) : (
        <Tag
          borderRadius="full"
          size="lg"
          variant="solid"
          className={'shadow-xl shadow-zinc-900/10 ' + className}
        >
          {author.displayName
            ? author.displayName.substring(0, 2).toLocaleUpperCase()
            : '?'}
        </Tag>
      )}
    </>
  )
}

export default Avatar
