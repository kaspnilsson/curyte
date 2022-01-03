/* eslint-disable @next/next/no-img-element */
import { Author } from '../interfaces/author'
import { Avatar } from '@chakra-ui/react'
import React from 'react'

type Props = {
  author: Author
  className?: string
}

const CuryteAvatar = ({ author, className }: Props) => {
  return (
    <>
      {!author && null}
      {author && (
        <Avatar
          src={author.photoURL}
          name={author.displayName}
          className={'shadow-xl shadow-zinc-900/10 ' + className}
          alt={author.displayName}
        />
      )}
    </>
  )
}

export default CuryteAvatar
