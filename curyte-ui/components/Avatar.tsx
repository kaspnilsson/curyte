/* eslint-disable @next/next/no-img-element */
import { Avatar } from '@chakra-ui/react'
import { Profile } from '@prisma/client'
import React from 'react'

type Props = {
  profile: Profile
  className?: string
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const CuryteAvatar = ({ profile, className, size = 'md' }: Props) => {
  if (!profile) return null

  return (
    <Avatar
      src={profile.photoUrl || undefined}
      name={profile.displayName || '?'}
      className={'shadow-xl shadow-zinc-900/10 ' + className}
      alt={profile.displayName}
      size={size}
    />
  )
}

export default CuryteAvatar
