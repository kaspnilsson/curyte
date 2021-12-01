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
import * as api from '../../firebase/api';

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
          <div className="border-b border-gray-200 pb-8 mb-8" key={lesson.uid}>
            <LessonPreview lesson={lesson} />
          </div>
        ))}
        `
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const author = await api.getAuthor(query.id as string);

  const lessons = await api.getLessons([
    { opStr: '==', value: author.uid, fieldPath: 'authorId' },
  ]);
  return {
    props: { lessons, author },
  };
};

export default UserView;
