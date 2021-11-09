/* eslint-disable react/jsx-filename-extension */
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Avatar from '../../components/Avatar';
import Container from '../../components/Container';
import Layout from '../../components/Layout';
import firebase from '../../firebase/clientApp';
import { Author } from '../../interfaces/author';
import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import LoadingSpinner from '../../components/LoadingSpinner';

const SettingsView = () => {
  const router = useRouter();

  const [user, userLoading, error] = useAuthState(firebase.auth());
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(userLoading);
  const [saving, setSaving] = useState(false);
  const [authorChanged, setAuthorChanged] = useState(false);

  const modifyAuthor = (a: Author) => {
    setAuthorChanged(true);
    setAuthor(a);
  };

  useEffect(() => {
    if (user && !author) {
      setLoading(true);
      const fetchAuthor = async () => {
        const author = await firebase
          .firestore()
          .collection('users')
          .doc(user!.uid)
          .get()
          .then((result) => ({
            ...(result.data() as Author),
          }));
        setAuthor(author);
        setLoading(false);
      };
      fetchAuthor();
    }
  }, [author, loading, user]);

  const handleSave = async (event: SyntheticEvent) => {
    event.preventDefault();
    setSaving(true);
    await firebase
      .firestore()
      .collection('users')
      .doc(user!.uid)
      .set({ ...author });
    setSaving(false);
  };

  const handleDelete = async (event: SyntheticEvent) => {
    event.preventDefault();
    setSaving(true);
    await firebase.auth().currentUser!.delete();
    setSaving(false);
    router.push('/');
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!author && !loading && <ErrorPage statusCode={404} />}
      {author && !loading && (
        <Layout>
          {saving && <LoadingSpinner />}
          <Container>
            <Avatar author={author}></Avatar>
            <section className="flex flex-col my-8">
              <div className="flex items-center justify-between">
                <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight">
                  Profile settings
                </h2>
                <Button
                  buttonType="outline"
                  className="w-fit-content disabled:opacity-50"
                  onClick={handleSave}
                  disabled={!authorChanged}
                >
                  Save
                </Button>
              </div>
              <div className="my-2">
                <Textarea
                  type="text"
                  size="lg"
                  outline
                  placeholder="Bio"
                  value={author.bio}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                    modifyAuthor({ ...author, bio: target.value })
                  }
                />
              </div>
              <div className="my-2">
                <Input
                  type="text"
                  size="lg"
                  outline
                  placeholder="Username"
                  value={author.username}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                    modifyAuthor({ ...author, username: target.value })
                  }
                />
              </div>
            </section>
            <section className="flex flex-col my-8">
              <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight">
                Email settings
              </h2>
              <div className="my-2">
                <Input
                  type="text"
                  size="lg"
                  outline
                  placeholder="Email"
                  value={author.email}
                  onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
                    modifyAuthor({ ...author, email: target.value })
                  }
                />
              </div>
            </section>
            <section className="flex flex-col my-8">
              <Button
                buttonType="outline"
                className="w-56"
                onClick={handleDelete}
              >
                Delete account
              </Button>
            </section>
          </Container>
        </Layout>
      )}
    </>
  );
};

export default SettingsView;
