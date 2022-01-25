import classNames from 'classnames'
import { auth } from '../firebase/clientApp'
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
  IconButton,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import Avatar from './Avatar'
import CuryteLogo from './CuryteLogo'
import { PencilIcon, SearchIcon } from '@heroicons/react/outline'
import {
  indexRoute,
  lessonSearchRoute,
  loginRoute,
  workspaceRoute,
  newLessonRoute,
  signupRoute,
  accountSettingsRoute,
  accountRoute,
  accountRouteHrefPath,
  newPathRoute,
} from '../utils/routes'
import { violet } from '../styles/theme/colors'
import LessonSearchModal from './LessonSearchModal'

type Props = {
  showProgressBar?: boolean
  title: string
  isSticky?: boolean
  withSearch?: boolean
}

const Header = ({
  showProgressBar,
  title,
  isSticky = true,
  withSearch = true,
}: Props) => {
  const [isStuck, setStuck] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
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
    auth.signOut()
  }

  const [user] = useAuthState(auth)

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
        className={classNames('z-10 bg-white mb-12 transition-shadow', {
          'sticky top-0': isSticky,
          'shadow-xl shadow-zinc-900/10': isSticky && isStuck,
        })}
      >
        <Container>
          <div className="flex items-center justify-between h-16 py-4">
            <Link href={user ? lessonSearchRoute() : indexRoute} passHref>
              <Button
                variant="link"
                colorScheme="black"
                className="flex items-center gap-1"
              >
                <CuryteLogo />
                <h2 className="text-xl font-bold leading-tight tracking-tighter md:text-2xl">
                  Curyte
                </h2>
              </Button>
            </Link>
            {withSearch && (
              <div className="flex-1 mx-4 md:mx-8 lg:mx-24" onClick={onOpen}>
                <InputGroup className="w-96" size="lg">
                  <InputLeftElement>
                    <SearchIcon className="w-5 h-5 text-zinc-500" />
                  </InputLeftElement>
                  <Input
                    isReadOnly
                    placeholder="Search lessons..."
                    variant="filled"
                    colorScheme="black"
                  ></Input>
                </InputGroup>
              </div>
            )}
            {!user && (
              <div className="flex items-center gap-2">
                <Link passHref href={loginRoute()}>
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link passHref href={signupRoute()}>
                  <Button colorScheme="black">Sign up</Button>
                </Link>
              </div>
            )}
            {user && (
              <div className="flex items-center gap-2">
                {/* <Tooltip label="Search lessons">
                  <IconButton
                    aria-label="Search lessons"
                    onClick={() => router.push(lessonSearchRoute())}
                    isRound
                    title="Start writing"
                    icon={<SearchIcon className="w-4 h-4 text-zinc-900" />}
                  />
                </Tooltip> */}
                <div className="relative">
                  <Menu>
                    <div className="z-0 rounded-full animated-border animate-spin-slow"></div>
                    <MenuButton
                      as={IconButton}
                      aria-label="Start writing"
                      isRound
                      className="shadow-xl opacity-100 shadow-zinc-900/10"
                      title="Start writing"
                      icon={<PencilIcon className="w-4 h-4 text-zinc-900" />}
                    />
                    <Portal>
                      <MenuList className="!shadow-md">
                        <Link passHref href={newLessonRoute()}>
                          <MenuItem className="flex-col !items-start">
                            <Text>New lesson</Text>
                            <Text fontSize="xs" className="text-zinc-500">
                              Create a new lesson from scratch.
                            </Text>
                          </MenuItem>
                        </Link>
                        <Link passHref href={newPathRoute}>
                          <MenuItem className="flex-col !items-start">
                            <Text>New path</Text>
                            <Text fontSize="xs" className="text-zinc-500">
                              Create an outline of a course, then fill it with
                              lessons.
                            </Text>
                          </MenuItem>
                        </Link>
                        <Link passHref href={workspaceRoute}>
                          <MenuItem className="flex-col !items-start">
                            <Text>Existing path or lesson</Text>
                            <Text fontSize="xs" className="text-zinc-500">
                              View all your work in the workspace.
                            </Text>
                          </MenuItem>
                        </Link>
                      </MenuList>
                    </Portal>
                  </Menu>
                </div>
                <div className="flex">
                  <Menu>
                    <MenuButton>
                      <Avatar author={user as unknown as Author} />
                    </MenuButton>
                    <Portal>
                      <MenuList className="!shadow-md">
                        <Link passHref href={workspaceRoute}>
                          <MenuItem className="flex-col !items-start">
                            <Text>Workspace</Text>
                            <Text fontSize="xs" className="text-zinc-500">
                              Create, edit, and publish new content.
                            </Text>
                          </MenuItem>
                        </Link>
                        <Link
                          passHref
                          as={accountRoute(user.uid)}
                          href={accountRouteHrefPath}
                        >
                          <MenuItem className="flex-col !items-start">
                            <Text>Profile</Text>
                            <Text fontSize="xs" className="text-zinc-500">
                              View your public profile.
                            </Text>
                          </MenuItem>
                        </Link>
                        <Link passHref href={accountSettingsRoute}>
                          <MenuItem className="flex-col !items-start">
                            <Text>Account settings</Text>
                            <Text fontSize="xs" className="text-zinc-500">
                              Update username, bio, and more.
                            </Text>
                          </MenuItem>
                        </Link>
                        <MenuItem
                          className="flex-col !items-start"
                          onClick={() => logOut()}
                        >
                          <Text>Sign out</Text>
                          <Text fontSize="xs" className="text-zinc-500">
                            Log out of Curyte.
                          </Text>
                        </MenuItem>
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
              background: violet[500],
              opacity: '0.8',
              marginTop: '-3px',
            }}
          />
        )}
        <LessonSearchModal isOpen={isOpen} onClose={onClose} />
      </div>
    </>
  )
}

export default Header
