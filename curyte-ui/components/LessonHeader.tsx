import firebase from '../firebase/clientApp';
import Link from 'next/link';
import React from 'react';
import { Author } from '../interfaces/author';
import Avatar from './Avatar';
import CoverImage from './CoverImage';
import DateFormatter from './DateFormatter';
import LessonTitle from './LessonTitle';
import { Button } from '@chakra-ui/react';

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
        <table>
          <tr className="text-sm">
            {lesson.updated && (
              <td className="pr-2 text-gray-500  text-right">Created</td>
            )}
            <td>
              {lesson.created && <DateFormatter dateString={lesson.created} />}
            </td>
          </tr>
          {lesson.updated && (
            <tr className="text-sm">
              <td className="pr-2 text-gray-500 text-right">Updated</td>
              <td>
                <DateFormatter dateString={lesson.updated} />
              </td>
            </tr>
          )}
        </table>
      </div>
      <div className="flex gap-2">
        <Link
          passHref
          as={`/lessons/edit/${lesson.uid}`}
          href="/lessons/edit/[id]"
        >
          <Button variant="outline">Edit / copy</Button>
        </Link>
        {handleDelete && (
          <Button variant="outline" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </>
  );
};

export default LessonHeader;
