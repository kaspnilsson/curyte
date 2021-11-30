import firebase from '../../firebase/clientApp';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import EditLessonPage from '../../components/EditLessonPage';
import { Author } from '../../interfaces/author';
import { LessonStorageModel } from '../../interfaces/lesson';
import { useRouter } from 'next/router';

const NewLessonView = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(firebase.auth());
  const handleSubmit = async (l: LessonStorageModel) => {
    const ref = await firebase.firestore().collection('lessons').add(l);
    router.push(`/lessons/${ref.id}`);
  };

  return (
    <EditLessonPage
      user={user as unknown as Author}
      handleSubmit={handleSubmit}
    />
  );
};

export default NewLessonView;
