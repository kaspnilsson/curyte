/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'
import Avatar from './Avatar'
import { accountRoute, accountRouteHrefPath } from '../utils/routes'
import classNames from 'classnames'
import { Profile } from '@prisma/client'

type Props = {
  author: Profile | null
  small?: boolean
  smallerPic?: boolean
}

const AuthorLink = ({ author, small = false, smallerPic = false }: Props) => {
  if (!author) return null

  return (
    <>
      {!author && null}
      {author && (
        <Link
          as={accountRoute(author.uid)}
          href={accountRouteHrefPath}
          passHref
        >
          <a className="flex items-center cursor-pointer group">
            <Avatar
              profile={author}
              className="shadow-xl shadow-zinc-900/10"
              size={small ? '2xs' : smallerPic ? 'sm' : 'md'}
            />
            <div className="flex flex-col max-w-xs min-w-0 gap-1 ml-2">
              <div
                className={classNames(
                  'text-xs sm:text-sm font-bold group-hover:underline tracking-tighter leading-tight',
                  { 'md:text-base': !small }
                )}
              >
                {author.displayName || '(no name)'}
              </div>
              {author.bio && !small && !smallerPic && (
                <span className="text-xs break-all line-clamp-1 text-zinc-500 text-ellipsis">
                  {author.bio}
                </span>
              )}
            </div>
          </a>
        </Link>
      )}
    </>
  )
}

export default AuthorLink
