import React from 'react';
import { Author } from '../interfaces/author';
import Avatar from './Avatar';
import CoverImage from './CoverImage';
import DateFormatter from './DateFormatter';
import LessonTitle from './LessonTitle';

type Props = {
  title: string;
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
    </>
  );
};

export default LessonHeader;
