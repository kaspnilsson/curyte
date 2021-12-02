/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Author } from '../interfaces/author';
import React from 'react';
import Avatar from './Avatar';

type Props = {
  author: Author;
};

const AuthorLink = ({ author }: Props) => {
  return (
    <>
      {!author && null}
      {author && (
        <div className="flex items-center">
          <Avatar author={author} className="shadow-xl w-8 h-8" />
          <Link as={`/accounts/${author.uid}`} href="/accounts/[id]" passHref>
            <a className="hover:underline font-bold ml-2">
              {author.displayName}
            </a>
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthorLink;
