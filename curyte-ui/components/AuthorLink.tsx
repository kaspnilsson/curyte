/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { Author } from '../interfaces/author'
import React from 'react'
import Avatar from './Avatar'
import { accountRoute, accountRouteHrefPath } from '../utils/routes'

type Props = {
  author: Author
}

const AuthorLink = ({ author }: Props) => {
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
              author={author}
              className="w-8 h-8 shadow-xl shadow-zinc-900/10"
            />
            <div className="flex flex-col ml-2">
              {/* TODO add role here! */}
              <span className="text-xs text-zinc-700">Instructor</span>
              <a className="text-sm font-bold group-hover:underline md:text-base">
                {author.displayName || '(no name)'}
              </a>
            </div>
          </div>
        </Link>
      )}
    </>
  )
}

export default AuthorLink
