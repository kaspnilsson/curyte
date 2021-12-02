/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Author } from '../interfaces/author';
import { Image, Tag } from '@chakra-ui/react';
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
              borderRadius="full"
              className={big ? 'shadow-xl w-40 h-40' : 'shadow-xl w-10 h-10'}
              alt={author.displayName}
            />
          ) : (
            <Tag borderRadius="full" size="lg" variant="solid">
              {author.displayName
                ? author.displayName.substring(0, 2).toLocaleUpperCase()
                : '?'}
            </Tag>
          )}
          {!photoOnly && (
            <Link as={`/accounts/${author.uid}`} href="/accounts/id">
              <a
                className={
                  big
                    ? 'hover:underline text-4xl font-bold ml-4'
                    : 'hover:underline text-lg font-bold ml-2'
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
