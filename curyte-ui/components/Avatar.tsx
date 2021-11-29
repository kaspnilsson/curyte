/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Author } from '../interfaces/author';
import Image from '@material-tailwind/react/Image';
import CardHeader from '@material-tailwind/react/CardHeader';
import React from 'react';

type Props = {
  author: Author;
  photoOnly?: boolean;
  big?: boolean;
};

const Avatar = ({ author, photoOnly, big }: Props) => {
  return (
    <>
      {!author && null}
      {author && (
        <div className="flex items-center">
          {author.photoURL ? (
            <Image
              src={author.photoURL}
              rounded={true}
              raised={true}
              className={big ? 'w-40 h-40' : 'w-10 h-10'}
              alt={author.displayName}
            />
          ) : (
            <CardHeader className="round" color="gray">
              {author.displayName ? author.displayName.substring(0, 2) : '?'}
            </CardHeader>
          )}
          {!photoOnly && (
            <Link as={`/accounts/${author.uid}`} href="/accounts/id">
              <a
                className={
                  big
                    ? 'hover:underline text-4xl font-bold ml-4'
                    : 'hover:underline text-lg font-bold ml-4'
                }
              >
                {author.displayName}
              </a>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Avatar;
