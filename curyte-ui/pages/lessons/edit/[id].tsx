import ErrorPage from 'next/error';
import React from 'react';
import { LessonStorageModel } from '../../../interfaces/lesson';
import firebase from '../../../firebase/clientApp';
import { GetServerSideProps } from 'next';
import { Author } from '../../../interfaces/author';
import { useAuthState } from 'react-firebase-hooks/auth';
import EditLessonPage from '../../../components/EditLessonPage';

type Props = {
  lesson: LessonStorageModel;
  author: Author;
};

const EditLessonView = ({ lesson, author }: Props) => {
  const [user, loading, error] = useAuthState(firebase.auth());

  if (!lesson || !lesson.title) return <ErrorPage statusCode={404} />;
  return <EditLessonPage lesson={lesson} user={user as unknown as Author} />;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const lesson = await firebase
    .firestore()
    .collection('lessons')
    .doc(query.id as string)
    .get()
    .then((result) => ({
      ...(result.data() as LessonStorageModel),
      lessonId: result.id,
    }));
  const author = await firebase
    .firestore()
    .collection('users')
    .doc(lesson.authorId)
    .get()
    .then((result) => ({
      ...(result.data() as Author),
    }));
  return {
    props: { lesson, author },
  };
};

export default EditLessonView;
