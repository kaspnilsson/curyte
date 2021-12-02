import firebase from '../firebase/clientApp';
import Link from 'next/link';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Author } from '../interfaces/author';
import Avatar from './Avatar';
import Container from './Container';
import { Button } from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import Head from 'next/head';
import router from 'next/router';

type Props = {
  children: React.ReactNode;
};

const Header = ({ children }: Props) => {
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    // Add scroll event when the component is loaded
    window.addEventListener('scroll', handleScroll);
    return () => {
      // Remove scroll event after the component is unmount,
      // like componentWillUnmount()
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setSticky(document.documentElement.scrollTop > 0);
  };

  const logOut = () => {
    firebase.auth().signOut();
  };

  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <>
      <Head>
        {/* Material Icons Link */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <div
        className={`sticky ${
          isSticky ? 'shadow-xl' : ''
        } top-0 z-10 bg-white py-4 mb-8 transition-shadow`}
      >
        <Container>
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight">
              <Link href="/">
                <a className="hover:underline">Curyte</a>
              </Link>
            </h2>
            <div className="flex flex-grow mx-4 md:mx-8 lg:mx-24">
              {children}
            </div>
            {!user && (
              <Link passHref href={'/login'}>
                <Button variant="outline">Log in</Button>
              </Link>
            )}
            {user && (
              <div className="flex items-center">
                <Link href="/lessons/new" passHref>
                  <Button className="font-semibold py-2 px-4">
                    Start writing
                  </Button>
                </Link>
                <div className="ml-4">
                  <Menu>
                    <MenuButton>
                      <Avatar author={user as unknown as Author} photoOnly />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => router.push('/accounts/me')}>
                        View account
                      </MenuItem>
                      <MenuItem onClick={() => logOut()}>Sign out</MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
