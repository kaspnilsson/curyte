import Link from 'next/link'
import React from 'react'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import Head from 'next/head'
import Avatar from './Avatar'
import { ChevronRightIcon, PencilIcon } from '@heroicons/react/outline'
import {
  loginRoute,
  workspaceRoute,
  newLessonRoute,
  accountSettingsRoute,
  accountRoute,
  accountRouteHrefPath,
  newPathRoute,
  logOutRoute,
} from '../utils/routes'
import { MobileSidebar } from './AppSidebar'
import Container from './Container'
import { useUserAndProfile } from '../contexts/user'
import { UrlObject } from 'url'

export interface BreadcrumbProps {
  href: string | UrlObject
  label: string
  as?: string
}

type Props = {
  title?: string
  breadcrumbs?: BreadcrumbProps[]
}

const Header = ({ title = 'Curyte', breadcrumbs = [] }: Props) => {
  const { userAndProfile } = useUserAndProfile()

  return (
    <>
      <Head>
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
      <div className="sticky top-0 z-20 bg-white border-b">
        <Container>
          <div className="flex items-center justify-between h-16 min-w-0 py-4">
            <div className="flex items-center min-w-0 gap-2 md:gap-4">
              <div className="md:hidden">
                <MobileSidebar />
              </div>
              {breadcrumbs.length ? (
                <div className="items-center hidden min-w-0 pr-4 xs:flex">
                  {breadcrumbs.map((b, index) => (
                    <>
                      {index !== 0 && (
                        <ChevronRightIcon
                          key={index}
                          className="w-3 h-3 md:w-4 md:h-4 text-zinc-500"
                        />
                      )}
                      <div key={index} className="min-w-0 truncate">
                        <Link as={b.as} href={b.href} passHref>
                          <a className="min-w-0 font-bold leading-tight tracking-tighter truncate hover:underline">
                            <Tooltip label={b.label}>{b.label}</Tooltip>
                          </a>
                        </Link>
                      </div>
                    </>
                  ))}
                </div>
              ) : null}
            </div>
            {!userAndProfile?.profile && (
              <div className="flex items-center gap-2">
                <Link passHref href={loginRoute()}>
                  <a>
                    <Button variant="outline">Log in</Button>
                  </a>
                </Link>
                <Link passHref href={loginRoute()}>
                  <a>
                    <Button colorScheme="black">Sign up</Button>
                  </a>
                </Link>
              </div>
            )}
            {userAndProfile?.profile && (
              <div className="flex items-center gap-2">
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
                          <a>
                            <MenuItem className="flex-col !items-start">
                              <Text>New lesson</Text>
                              <Text fontSize="xs" className="text-zinc-500">
                                Create a new lesson from scratch.
                              </Text>
                            </MenuItem>
                          </a>
                        </Link>
                        <Link passHref href={newPathRoute}>
                          <a>
                            <MenuItem className="flex-col !items-start">
                              <Text>New path</Text>
                              <Text fontSize="xs" className="text-zinc-500">
                                Create an outline of a course, then fill it with
                                lessons.
                              </Text>
                            </MenuItem>
                          </a>
                        </Link>
                        <Link passHref href={workspaceRoute}>
                          <a>
                            <MenuItem className="flex-col !items-start">
                              <Text>Existing path or lesson</Text>
                              <Text fontSize="xs" className="text-zinc-500">
                                View all your work in the workspace.
                              </Text>
                            </MenuItem>
                          </a>
                        </Link>
                      </MenuList>
                    </Portal>
                  </Menu>
                </div>
                <div className="flex">
                  <Menu>
                    <MenuButton>
                      <Avatar profile={userAndProfile?.profile} />
                    </MenuButton>
                    <Portal>
                      <MenuList className="!shadow-md">
                        <Link passHref href={workspaceRoute}>
                          <a>
                            <MenuItem className="flex-col !items-start">
                              <Text>Workspace</Text>
                              <Text fontSize="xs" className="text-zinc-500">
                                Create, edit, and publish new content.
                              </Text>
                            </MenuItem>
                          </a>
                        </Link>
                        <Link
                          passHref
                          as={accountRoute(userAndProfile?.profile.uid)}
                          href={accountRouteHrefPath}
                        >
                          <a>
                            <MenuItem className="flex-col !items-start">
                              <Text>Profile</Text>
                              <Text fontSize="xs" className="text-zinc-500">
                                View your public profile.
                              </Text>
                            </MenuItem>
                          </a>
                        </Link>
                        <Link passHref href={accountSettingsRoute}>
                          <a>
                            <MenuItem className="flex-col !items-start">
                              <Text>Account settings</Text>
                              <Text fontSize="xs" className="text-zinc-500">
                                Update username, bio, and more.
                              </Text>
                            </MenuItem>
                          </a>
                        </Link>

                        <Link passHref href={logOutRoute}>
                          <a>
                            <MenuItem className="flex-col !items-start">
                              <Text>Sign out</Text>
                              <Text fontSize="xs" className="text-zinc-500">
                                Log out of Curyte.
                              </Text>
                            </MenuItem>
                          </a>
                        </Link>
                      </MenuList>
                    </Portal>
                  </Menu>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
export default Header
