import Head from 'next/head';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LessonStorageModel } from '../../interfaces/lesson';
import firebase from '../../firebase/clientApp';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import { Author } from '../../interfaces/author';
import Header from '../../components/Header';
import Container from '../../components/Container';
import LessonTitle from '../../components/LessonTitle';
import LessonHeader from '../../components/LessonHeader';
import LessonSection from '../../components/LessonSection';

type Props = {
  lesson: LessonStorageModel;
  author: Author;
};

const LessonView = ({ lesson, author }: Props) => {
  const router = useRouter();
  if (!router.isFallback && (!lesson || !lesson.title))
    return <ErrorPage statusCode={404} />;
  return (
    <Layout>
      <Container>
        {router.isFallback ? (
          <LessonTitle>Loading…</LessonTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{lesson.title}</title>
                {/* <meta property="og:image" content={lesson.ogImage.url} /> */}
              </Head>
              <LessonHeader
                description={lesson.description}
                title={lesson.title}
                // coverImage={undefined}
                date={lesson.created}
                author={author}
              />
              {lesson.sections.map((section, index) => (
                <LessonSection section={section} key={index} />
              ))}
            </article>
          </>
        )}
      </Container>
    </Layout>
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
