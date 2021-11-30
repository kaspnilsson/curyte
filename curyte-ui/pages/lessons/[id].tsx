import Head from 'next/head';
import ErrorPage from 'next/error';
import React, { useState } from 'react';
import { LessonStorageModel } from '../../interfaces/lesson';
import firebase from '../../firebase/clientApp';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import { Author } from '../../interfaces/author';
import Container from '../../components/Container';
import LessonHeader from '../../components/LessonHeader';
import LessonSection from '../../components/LessonSection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../components/LoadingSpinner';

type Props = {
  lesson: LessonStorageModel;
  author: Author;
};

const LessonView = ({ lesson, author }: Props) => {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const handleDelete = async () => {
    setSaving(true);
    await firebase
      .firestore()
      .collection('lessons')
      .doc(lesson.lessonId)
      .delete();
    setSaving(false);
    router.push('/');
  };

  if (!lesson || !lesson.title) return <ErrorPage statusCode={404} />;

  return (
    <>
      {saving && <LoadingSpinner />}
      <Layout>
        <Container>
          <article className="mb-32">
            <Head>
              <title>{lesson.title}</title>
            </Head>
            <LessonHeader
              author={author}
              lesson={lesson}
              handleDelete={
                user && user.uid === lesson.authorId ? handleDelete : undefined
              }
            />
            {lesson.sections.map((section, index) => (
              <LessonSection section={section} key={index} />
            ))}
          </article>
        </Container>
      </Layout>
    </>
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

export default LessonView;
