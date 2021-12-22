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
        <div className="flex items-center">
          <Avatar
            author={author}
            className="w-8 h-8 shadow-xl shadow-zinc-900/10"
          />
          <Link
            as={accountRoute(author.uid)}
            href={accountRouteHrefPath}
            passHref
          >
            <a className="ml-2 text-sm font-bold hover:underline md:text-base">
              {author.displayName}
            </a>
          </Link>
        </div>
      )}
    </>
  )
}

export default AuthorLink
