// index.tsx
import Head from 'next/head';

import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect, useState } from 'react';
import { LessonStorageModel } from '../../interfaces/lesson';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import LessonPreview from '../../components/LessonPreview';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as api from '../../firebase/api';
import firebase from '../../firebase/clientApp';

const DraftsPage = () => {
  const [user, userLoading, error] = useAuthState(firebase.auth());
  const [lessons, setLessons] = useState<LessonStorageModel[]>([]);
  const [loading, setLoading] = useState(userLoading);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    api
      .getLessons([
        { fieldPath: 'published', opStr: '==', value: false },
        { fieldPath: 'authorId', opStr: '==', value: user.uid },
      ])
      .then((res) => {
        setLoading(false);
        setLessons(res);
      });
  }, [user]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Layout>
            <Head>
              <title>Drafts</title>
            </Head>
            <Container>
              {lessons.map((lesson) => (
                <div
                  className="border-b border-gray-200 pb-8 mb-8"
                  key={lesson.uid}
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

export default DraftsPage;
