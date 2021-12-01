import firebase from '../../firebase/clientApp';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import EditLessonPage from '../../components/EditLessonPage';
import { Author } from '../../interfaces/author';
import { LessonStorageModel } from '../../interfaces/lesson';
import { useRouter } from 'next/router';
import * as api from '../../firebase/api';

const NewLessonView = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(firebase.auth());
  const handleSubmit = async (l: LessonStorageModel) => {
    const uid = await api.updateLesson(l);
    router.push(`/lessons/${uid}`);
  };
  const handleSaveDraft = async (l: LessonStorageModel) => {
    const uid = await api.updateLesson(l);
    router.push(`/lessons/edit/${uid}`);
  };

  return (
    <EditLessonPage
      user={user as unknown as Author}
      handleSubmit={handleSubmit}
      handleSaveDraft={handleSaveDraft}
    />
  );
};

export default NewLessonView;
