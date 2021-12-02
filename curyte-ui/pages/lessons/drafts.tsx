import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect, useState } from 'react';
import { LessonStorageModel } from '../../interfaces/lesson';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as api from '../../firebase/api';
import firebase from '../../firebase/clientApp';
import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/outline';
import LessonLink from '../../components/LessonLink';

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
          {lessons.map((lesson) => (
            <div className="mb-3" key={lesson.uid}>
              <LessonLink lesson={lesson} />
            </div>
          ))}
          {!lessons.length && 'No drafts!'}
        </>
      )}
    </>
  );
};

export default DraftsPage;
