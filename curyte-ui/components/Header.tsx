import classNames from 'classnames'
import firebase from '../firebase/clientApp'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Author } from '../interfaces/author'
import Container from './Container'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react'
import Head from 'next/head'
import Avatar from './Avatar'
import CuryteLogo from './CuryteLogo'
import { indexRoute, loginRoute, newLessonRoute } from '../utils/routes'

type Props = {
  children: React.ReactNode
  showProgressBar?: boolean
  title: string
  isSticky?: boolean
}

const Header = ({
  children,
  showProgressBar,
  title,
  isSticky = true,
}: Props) => {
  const [isStuck, setStuck] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (isSticky) setStuck(document.documentElement.scrollTop > 0)
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

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isSticky])

  const logOut = () => {
    firebase.auth().signOut()
  }

  const [user] = useAuthState(firebase.auth())

  return (
    <>
      <Head>
        {/* Material Icons Link */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="/static/curyte_logo_black.svg"
          media="(prefers-color-scheme:no-preference)"
        />
        <link
          rel="icon"
          href="/static/curyte_logo_white.svg"
          media="(prefers-color-scheme:dark)"
        />
        <link
          rel="icon"
          href="/static/curyte_logo_black.svg"
          media="(prefers-color-scheme:light)"
        />
        <title>{title}</title>
      </Head>
      <div
        className={classNames('z-10 bg-white mb-4 transition-shadow', {
          'sticky top-0': isSticky,
          'shadow-xl': isSticky && isStuck,
        })}
      >
        <Container>
          <div className="flex justify-between items-center py-4 h-16">
            <Link href={indexRoute} passHref>
              <Button
                variant="link"
                colorScheme="black"
                className="flex gap-1 items-center"
              >
                <CuryteLogo />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight">
                  Curyte
                </h2>
              </Button>
            </Link>
            <div className="flex flex-grow mx-4 md:mx-8 lg:mx-24">
              {children}
            </div>
            {!user && (
              <Link passHref href={loginRoute}>
                <Button variant="outline">Log in</Button>
              </Link>
            )}
            {user && (
              <div className="flex items-center">
                <Link href={newLessonRoute()} passHref>
                  <Button
                    className="font-semibold py-2 px-4"
                    colorScheme="purple"
                  >
                    Start writing
                  </Button>
                </Link>
                <div className="ml-4 flex">
                  <Menu>
                    <MenuButton>
                      <Avatar
                        author={user as unknown as Author}
                        className="w-10 h-10"
                      />
                    </MenuButton>
                    <Portal>
                      <MenuList>
                        <Link passHref href="/accounts/me">
                          <MenuItem>View account</MenuItem>
                        </Link>
                        <MenuItem onClick={() => logOut()}>Sign out</MenuItem>
                      </MenuList>
                    </Portal>
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
              background: '#805AD5',
              opacity: '0.8',
              marginTop: '-3px',
            }}
          />
        )}
      </div>
    </>
  )
}

export default Header
