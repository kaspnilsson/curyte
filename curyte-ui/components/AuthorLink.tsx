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
}

const AuthorLink = ({ author, small = false }: Props) => {
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
          <div className="flex items-center cursor-pointer group">
            <Avatar
              profile={author}
              className="shadow-xl shadow-zinc-900/10"
              size={small ? '2xs' : 'md'}
            />
            <div className="flex flex-col gap-1 ml-2">
              <a
                className={classNames(
                  'text-xs sm:text-sm font-bold group-hover:underline tracking-tighter leading-tight',
                  { 'md:text-base': !small }
                )}
              >
                {author.displayName || '(no name)'}
              </a>
              {author.bio && !small && (
                <span className="text-xs break-all line-clamp-1 text-zinc-500">
                  {author.bio}
                </span>
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  )
}

export default AuthorLink
