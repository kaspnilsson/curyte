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
import LoadingSpinner from '../components/LoadingSpinner';
import Input from '@material-tailwind/react/Input';
import { DocumentData } from '@google-cloud/firestore';
import { useFuzzy } from '../hooks/useFuzzy';

const mapToLesson = (doc: DocumentData): LessonStorageModel => ({
  ...doc.data(),
  lessonId: doc.id,
});

const fuseOptions = {
  distance: 10000,
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'sections.title', weight: 0.15 },
    { name: 'sections.content', weight: 0.05 },
  ],
};

const Home = () => {
  const db = firebase.firestore();

  const [unmappedLessons, lessonsLoading, lessonsError] =
    useCollection<LessonStorageModel>(db.collection('lessons'), {});
  const lessons = (unmappedLessons?.docs || [])
    .map(mapToLesson)
    .sort((a, b) => b.created.localeCompare(a.created));

  const [user, userLoading, error] = useAuthState(firebase.auth());

  const loading = lessonsLoading || userLoading;

  const { result, keyword, search } = useFuzzy<LessonStorageModel>(
    lessons,
    fuseOptions
  );

  return (
    <>
      {loading && <LoadingSpinner />}
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
                {/* <p className="text-center tracking-tighter mb-8 text-gray-700">
                  Because lessons can be so much more than just PDFs from the
                  90s.
                </p> */}

                <Input
                  type="text"
                  size="lg"
                  outline
                  placeholder="Search for a lesson..."
                  value={keyword}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                    search(target.value)
                  }
                />
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
              {result.map((lesson) => (
                <div
                  className="border-b border-gray-200 pb-8 mb-8"
                  key={lesson.lessonId}
                >
                  <LessonPreview lesson={lesson} />
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
