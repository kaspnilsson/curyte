import firebase from '../../firebase/clientApp';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import EditLessonPage from '../../components/EditLessonPage';
import { Author } from '../../interfaces/author';

const NewLessonView = () => {
  const [user, loading, error] = useAuthState(firebase.auth());
  return <EditLessonPage user={user as unknown as Author} />;
};

export default NewLessonView;
