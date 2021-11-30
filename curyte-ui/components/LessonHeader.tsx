import firebase from '../firebase/clientApp';
import Link from 'next/link';
import React from 'react';
import { Author } from '../interfaces/author';
import Avatar from './Avatar';
import CoverImage from './CoverImage';
import DateFormatter from './DateFormatter';
import LessonTitle from './LessonTitle';
import Button from '@material-tailwind/react/Button';
import { useRouter } from 'next/router';
import { LessonStorageModel } from '../interfaces/lesson';

type Props = {
  lesson: LessonStorageModel;
  coverImage?: string;
  author: Author;
  handleDelete?: () => void;
};

const LessonHeader = ({ author, lesson, handleDelete }: Props) => {
  return (
    <>
      <LessonTitle>{lesson.title}</LessonTitle>
      {lesson.parentLessonId && (
        <Link as={`/lessons/${lesson.parentLessonId}`} href="/lessons/[id]">
          <a className="hover:underline text-blue">View original</a>
        </Link>
      )}
      <div className="text-2xl focus:outline-none mt-1 text-gray-500 mb-8">
        {lesson.description}
      </div>
      {/* <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage || ''} />
      </div> */}
      <div className="flex mb-6 items-center justify-between">
        <div className="">
          <Avatar author={author} />
        </div>
        <div>
          <div className="text-sm flex items-center">
            {lesson.updated && (
              <div className="mr-1 text-gray-500">Created:</div>
            )}
            {lesson.created && <DateFormatter dateString={lesson.created} />}
          </div>
          {lesson.updated && (
            <div className="text-sm flex items-center">
              <div className="mr-1 text-gray-500">Updated:</div>
              <DateFormatter dateString={lesson.updated} />
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          passHref
          as={`/lessons/edit/${lesson.lessonId}`}
          href="/lessons/edit/[id]"
        >
          <Button buttonType="outline">Edit / copy</Button>
        </Link>
        {handleDelete && (
          <Button buttonType="outline" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </>
  );
};

export default LessonHeader;
