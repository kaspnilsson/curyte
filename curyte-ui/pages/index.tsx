// index.tsx
import Head from 'next/head';
import Link from 'next/link';
import { useCollection } from 'react-firebase-hooks/firestore';
import Auth from '../components/Auth';

import Image from 'next/image';
import styles from '../styles/Home.module.css';
import firebase from '../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect, useState } from 'react';
import { LessonStorageModel, LessonInfo } from '../interfaces/lesson';
import Layout from '../components/Layout';
import Container from '../components/Container';
import Button from '@material-tailwind/react/Button';
import LessonPreview from '../components/LessonPreview';

const Home = () => {
  const db = firebase.firestore();

  const [lessons, lessonsLoading, lessonsError] =
    useCollection<LessonStorageModel>(db.collection('lessons'), {});

  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <>
      {loading && <h4>Loading...</h4>}
      {!loading && (
        <>
          <Layout>
            <Head>
              <title>Curyte</title>
            </Head>
            <Container>
              <section className="flex-row flex items-center justify-center mt-16 mb-8">
                <h1 className="text-4xl md:text-6xl text-center font-bold tracking-tighter leading-tight">
                  Curriculum for the digital age.
                </h1>
              </section>
              <section className="flex-col flex items-center justify-around">
                <p className="text-center tracking-tighter mb-8 text-gray-700">
                  Because lessons can be so much more than just PDFs from the
                  90s.
                </p>
                {user ? null : (
                  <Link href="/login" passHref>
                    <Button
                      className="font-semibold py-2 px-4 "
                      buttonType="outline"
                    >
                      Get started
                    </Button>
                  </Link>
                )}
              </section>
              {lessons?.docs?.map((lesson) => (
                <div
                  className="border-b border-gray-200 pb-8 mb-8"
                  key={lesson.id}
                >
                  <LessonPreview
                    lesson={{ ...lesson.data(), lessonId: lesson.id }}
                  />
                </div>
              ))}
            </Container>
          </Layout>
        </>
      )}
    </>
  );
};

export default Home;
