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
import LessonPreview from '../../components/LessonPreview';
import Avatar from '../../components/Avatar';

type Props = {
  lessons: LessonStorageModel[];
  author: Author;
};

const UserView = ({ lessons, author }: Props) => {
  const [user, loading, error] = useAuthState(firebase.auth());
  return (
    <Layout>
      <Container>
        <Avatar big author={author}></Avatar>
        <section className="flex flex-col my-8">
          <div className="my-2">{author.bio}</div>
        </section>
        <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight">
          Lessons
        </h2>
        {lessons.map((lesson) => (
          <div
            className="border-b border-gray-200 pb-8 mb-8"
            key={lesson.lessonId}
          >
            <LessonPreview lesson={lesson} />
          </div>
        ))}
        `
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const author = await firebase
    .firestore()
    .collection('users')
    .doc(query.id as string)
    .get()
    .then((result) => ({
      ...(result.data() as Author),
    }));

  const lessons = await firebase
    .firestore()
    .collection('lessons')
    .where('authorId', '==', author.uid)
    .get()
    .then((result) => {
      const mapped: LessonStorageModel[] = [];
      result.docs.forEach((result) =>
        mapped.push({
          ...(result.data() as LessonStorageModel),
          lessonId: result.id,
        })
      );
      return mapped;
    })
    .then((result) => {
      result.sort((a, b) => (b.created || '').localeCompare(a.created || ''));
      return result;
    });
  return {
    props: { lessons, author },
  };
};

export default UserView;
