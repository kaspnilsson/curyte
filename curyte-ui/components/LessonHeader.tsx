import Link from 'next/link';
import React from 'react';
import { Author } from '../interfaces/author';
import Avatar from './Avatar';
import CoverImage from './CoverImage';
import DateFormatter from './DateFormatter';
import LessonTitle from './LessonTitle';
import Button from '@material-tailwind/react/Button';

type Props = {
  title: string;
  lessonId: string;
  description: string;
  coverImage?: string;
  date: string;
  author: Author;
};

const LessonHeader = ({
  title,
  description,
  coverImage,
  date,
  author,
  lessonId,
}: Props) => {
  return (
    <>
      <LessonTitle>{title}</LessonTitle>
      <div className="text-2xl focus:outline-none mt-1 text-gray-500 mb-8">
        {description}
      </div>
      {/* <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage || ''} />
      </div> */}
      <div className="flex mb-6 items-center justify-between">
        <div className="">
          <Avatar author={author} />
        </div>
        <div className="text-sm">
          <DateFormatter dateString={date} />
        </div>
      </div>
      <div>
        <Link
          passHref
          as={`/lessons/edit/${lessonId}`}
          href="/lessons/edit/[id]"
        >
          <Button buttonType="outline">Edit</Button>
        </Link>
      </div>
    </>
  );
};

export default LessonHeader;
