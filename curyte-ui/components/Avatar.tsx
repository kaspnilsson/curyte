/* eslint-disable @next/next/no-img-element */
import { Author } from '../interfaces/author'
import { Avatar } from '@chakra-ui/react'
import React from 'react'

type Props = {
  author: Author
  className?: string
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const CuryteAvatar = ({ author, className, size = 'md' }: Props) => {
  if (!author) return null
  return (
    <Avatar
      src={author.photoURL}
      name={author.displayName}
      className={'shadow-xl shadow-zinc-900/10 ' + className}
      alt={author.displayName}
      size={size}
    />
  )
}

export default CuryteAvatar
