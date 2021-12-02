import firebase from '../firebase/clientApp'
import Link from 'next/link'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Author } from '../interfaces/author'
import Container from './Container'
import { Button } from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import Head from 'next/head'
import router from 'next/router'
import Avatar from './Avatar'

type Props = {
  children: React.ReactNode
  showProgressBar?: boolean
}

const Header = ({ children, showProgressBar }: Props) => {
  const [isSticky, setSticky] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Add scroll event when the component is loaded
    window.addEventListener('scroll', handleScroll)
    return () => {
      // Remove scroll event after the component is unmount,
      // like componentWillUnmount()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    setSticky(document.documentElement.scrollTop > 0)
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100
    if (height > 0) {
      setProgress(scrolled)
    } else {
      setProgress(0)
    }
  }

  const logOut = () => {
    firebase.auth().signOut()
  }

  const [user, loading, error] = useAuthState(firebase.auth())

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
        } top-0 z-10 bg-white mb-4 transition-shadow`}
      >
        <Container>
          <div className="flex justify-between items-center py-4">
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
                      <Avatar
                        author={user as unknown as Author}
                        className="w-10 h-10"
                      />
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
        {showProgressBar && (
          <div
            style={{
              width: `${progress}%`,
              height: '3px',
              background: 'blue',
              opacity: '0.5',
              marginTop: '-3px',
            }}
          />
        )}
      </div>
    </>
  )
}

export default Header
