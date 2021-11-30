import ErrorPage from 'next/error';
import React from 'react';
import { LessonStorageModel } from '../../../interfaces/lesson';
import firebase from '../../../firebase/clientApp';
import { GetServerSideProps } from 'next';
import { Author } from '../../../interfaces/author';
import { useAuthState } from 'react-firebase-hooks/auth';
import EditLessonPage from '../../../components/EditLessonPage';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../../components/LoadingSpinner';

type Props = {
  lesson: LessonStorageModel;
};

const EditLessonView = ({ lesson }: Props) => {
  const [user, loading, error] = useAuthState(firebase.auth());
  const router = useRouter();

  const handleSubmit = async (l: LessonStorageModel) => {
    if (user && user.uid && user?.uid === lesson?.authorId) {
      const ref = await firebase
        .firestore()
        .collection('lessons')
        .doc(lesson.lessonId)
        .set(l);
      router.push(`/lessons/${lesson.lessonId}`);
    } else {
      // Logged in user is making a clone
      const ref = await firebase
        .firestore()
        .collection('lessons')
        .add({
          ...l,
          parentLessonId: lesson!.lessonId,
        });
      router.push(`/lessons/${ref.id}`);
    }
  };
  const handleSaveDraft = async (l: LessonStorageModel) => {
    if (user && user.uid && user?.uid === lesson?.authorId) {
      const ref = await firebase
        .firestore()
        .collection('lessons')
        .doc(lesson.lessonId)
        .set(l);
      router.push(`/lessons/edit/${lesson.lessonId}`);
    } else {
      // Logged in user is making a clone
      const ref = await firebase
        .firestore()
        .collection('lessons')
        .add({
          ...l,
          parentLessonId: lesson!.lessonId,
        });
      router.push(`/lessons/edit/${ref.id}`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!lesson || !lesson.title || !user) return <ErrorPage statusCode={404} />;
  return (
    <EditLessonPage
      lesson={lesson}
      user={user as unknown as Author}
      handleSubmit={handleSubmit}
      handleSaveDraft={handleSaveDraft}
    />
  );
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

  return {
    props: { lesson },
  };
};

export default EditLessonView;
