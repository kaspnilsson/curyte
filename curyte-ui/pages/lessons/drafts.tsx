import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect, useState } from 'react';
import { LessonStorageModel } from '../../interfaces/lesson';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as api from '../../firebase/api';
import firebase from '../../firebase/clientApp';
import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/outline';

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
            <Link
              as={`/lessons/${lesson.uid}`}
              href="/lessons/[id]"
              passHref
              key={lesson.uid}
            >
              <h3 className="text-xl mb-3 leading-snug w-auto">
                <a className="hover:underline w-auto flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  {lesson.title || '(no title)'}
                </a>
              </h3>
            </Link>
          ))}
          {!lessons.length && 'No drafts!'}
        </>
      )}
    </>
  );
};

export default DraftsPage;
