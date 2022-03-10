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
  BreadcrumbItem,
  Breadcrumb,
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
import classNames from 'classnames'
import { useUser } from '../contexts/user'
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
  const { userAndProfile } = useUser()

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
          <div className="flex items-center justify-between h-16 py-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="md:hidden">
                <MobileSidebar />
              </div>
              {breadcrumbs.length ? (
                <Breadcrumb
                  spacing="0"
                  separator={
                    <ChevronRightIcon className="w-3 h-3 md:w-5 md:h-5 text-zinc-500" />
                  }
                  className="flex flex-wrap -mx-2"
                >
                  {breadcrumbs.map((b, index) => (
                    <BreadcrumbItem key={index}>
                      <Link as={b.as} href={b.href} passHref>
                        <Button
                          size="xs"
                          className={classNames('truncate min-w-0 !py-4', {
                            'max-w-[15vw] !text-sm md:!text-base lg:!text-xl':
                              breadcrumbs.length > 2,
                            'max-w-[25vw] !text-xs md:!text-base lg:!text-xl':
                              breadcrumbs.length == 2,
                            'max-w-[50vw] !text-base lg:!text-xl':
                              breadcrumbs.length < 2,
                          })}
                          variant="ghost"
                        >
                          <Tooltip label={b.label}>
                            <Text className="min-w-0 font-bold leading-tight tracking-tighter truncate">
                              {b.label}
                            </Text>
                          </Tooltip>
                        </Button>
                      </Link>
                    </BreadcrumbItem>
                  ))}
                </Breadcrumb>
              ) : null}
            </div>
            {!userAndProfile?.profile && (
              <div className="flex items-center gap-2">
                <Link passHref href={loginRoute()}>
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link passHref href={loginRoute()}>
                  <Button colorScheme="black">Sign up</Button>
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
                      <Avatar profile={userAndProfile?.profile} />
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
                          as={accountRoute(userAndProfile?.profile.uid)}
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

                        <Link passHref href={logOutRoute}>
                          <MenuItem className="flex-col !items-start">
                            <Text>Sign out</Text>
                            <Text fontSize="xs" className="text-zinc-500">
                              Log out of Curyte.
                            </Text>
                          </MenuItem>
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
