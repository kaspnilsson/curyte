/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { Author } from '../interfaces/author'
import React from 'react'
import Avatar from './Avatar'
import { accountRoute, accountRouteHrefPath } from '../utils/routes'
import classNames from 'classnames'

type Props = {
  author: Author
  small?: boolean
}

const AuthorLink = ({ author, small = false }: Props) => {
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
              className="shadow-xl shadow-zinc-900/10"
              size={small ? '2xs' : 'md'}
            />
            <div className="flex flex-col ml-2">
              <a
                className={classNames(
                  'text-sm font-bold group-hover:underline',
                  { 'md:text-base': !small }
                )}
              >
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
