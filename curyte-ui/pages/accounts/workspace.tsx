/* eslint-disable react/jsx-filename-extension */
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import React, { useEffect } from 'react'
import Layout from '../../components/Layout'
import {
  Button,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import {
  discordInviteHref,
  loginRoute,
  newLessonRoute,
  newLessonRouteHref,
  newPathRoute,
  workspaceRoute,
} from '../../utils/routes'
import LessonList from '../../components/LessonList'
import PathPreview from '../../components/PathPreview'
import Link from 'next/link'
import {
  AcademicCapIcon,
  DocumentTextIcon,
  SupportIcon,
} from '@heroicons/react/outline'
import supabase from '../../supabase/client'
import { GetServerSideProps } from 'next'
import prismaClient from '../../lib/prisma'
import { useUser } from '../../contexts/user'
import { PathWithProfile } from '../../interfaces/path_with_profile'
import { LessonWithProfile } from '../../interfaces/lesson_with_profile'
import LoadingSpinner from '../../components/LoadingSpinner'

interface Props {
  paths: PathWithProfile[]
  lessons: LessonWithProfile[]
}

const WorkspaceView = ({ paths, lessons }: Props) => {
  const router = useRouter()
  const { userAndProfile, loading } = useUser()

  useEffect(() => {
    if (!userAndProfile) router.push(loginRoute())
  }, [userAndProfile, router])

  if (loading) return <LoadingSpinner />
  return (
    <>
      {!userAndProfile && <ErrorPage statusCode={403} />}
      {userAndProfile && (
        <Layout
          breadcrumbs={[
            {
              label: 'Workspace',
              href: workspaceRoute,
              as: workspaceRoute,
            },
          ]}
          title="Workspace"
          rightContent={
            <div className="flex flex-col w-full gap-8">
              <section>
                <Heading
                  className="mb-2 font-bold leading-tight tracking-tighter"
                  size="md"
                >
                  Create
                </Heading>
                <div className="flex flex-col items-start gap-2">
                  <Link
                    as={newLessonRoute()}
                    href={newLessonRouteHref}
                    passHref
                  >
                    <Button className="flex items-center gap-1">
                      Create a lesson
                      <DocumentTextIcon className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link as={newPathRoute} href={newPathRoute} passHref>
                    <Button className="flex items-center gap-1">
                      Create a path
                      <AcademicCapIcon className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </section>
              <section>
                <Heading
                  className="mb-2 font-bold leading-tight tracking-tighter"
                  size="md"
                >
                  Resources
                </Heading>
                <ul className="flex flex-col items-start gap-2 ml-6 list-disc list-outside">
                  <li className="hover:underline">
                    <Link
                      href="https://www.curyte.com/lessons/aa19daf3-3399-40db-bfda-be3c7f64f083"
                      passHref
                    >
                      Getting started with Curyte
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link
                      href="http://curyte.com/lessons/writing-a-lesson-on-curyte-1639450877617"
                      passHref
                    >
                      Writing your first lesson
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link
                      href="http://curyte.com/lessons/4Jhyh_peR2IJyLo8"
                      passHref
                    >
                      The 5E Method
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link
                      href="http://curyte.com/lessons/8e7265ed-5aba-4283-939a-cd3c20bbdf5d"
                      passHref
                    >
                      Adding embedded content
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link
                      href="http://curyte.com/lessons/WxzMiQtgkuigQeM7"
                      passHref
                    >
                      Curriculum and copyright
                    </Link>
                  </li>
                </ul>
                <a href={discordInviteHref} target="_blank" rel="noreferrer">
                  <Button className="flex items-center gap-1 mt-4">
                    Get help
                    <SupportIcon className="w-5 h-5" />
                  </Button>
                </a>
              </section>
            </div>
          }
        >
          <section className="flex flex-row">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
              Workspace
            </h1>
          </section>
          <div className="w-full pt-2 mt-4">
            <Tabs colorScheme="black" isLazy>
              <TabList>
                <Tab>Lessons</Tab>
                <Tab>Paths</Tab>
                {/* <Tab>Bookmarks</Tab> */}
              </TabList>
              <TabPanels>
                <TabPanel className="!px-0">
                  {!lessons.length && (
                    <div className="flex flex-col items-start gap-2">
                      <div className="text-sm text-zinc-500">
                        Nothing here yet!
                      </div>
                      <Link
                        as={newLessonRoute()}
                        href={newLessonRouteHref}
                        passHref
                      >
                        <Button className="flex items-center w-auto gap-1">
                          Create a lesson
                          <DocumentTextIcon className="w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                  {!!lessons.length && <LessonList lessons={lessons} />}
                </TabPanel>
                <TabPanel className="!px-0">
                  {!paths.length && (
                    <div className="flex flex-col items-start gap-2">
                      <div className="text-sm text-zinc-500">
                        Nothing here yet!
                      </div>
                      <Link as={newPathRoute} href={newPathRoute} passHref>
                        <Button className="flex items-center gap-1">
                          Create a path
                          <AcademicCapIcon className="w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                  {!!paths.length && (
                    <div className="flex flex-wrap w-full divide-y">
                      {paths.map((p) => (
                        <PathPreview
                          path={p}
                          key={p.uid}
                          author={userAndProfile.profile}
                        />
                      ))}
                    </div>
                  )}
                </TabPanel>
                {/* <TabPanel className="!px-0">
                  {!savedLessons.length && <div className="text-sm text-zinc-500">Nothing here yet!</div>}
                  {!!savedLessons.length && (
                    <LessonList lessons={savedLessons} />
                  )}
                </TabPanel> */}
              </TabPanels>
            </Tabs>
          </div>
        </Layout>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)
  if (!user) {
    return { props: {}, redirect: { destination: loginRoute() } }
  }
  // TODO(kasper): rework saved lessons
  const [lessons, paths] = await Promise.all([
    prismaClient.lesson.findMany({
      where: { authorId: user.id },
      orderBy: { updated: 'desc' },
      include: { profiles: true },
    }),
    prismaClient.path.findMany({
      where: { authorId: user.id },
      orderBy: { updated: 'desc' },
      include: { profiles: true },
    }),
  ])

  return { props: { lessons, paths } }
}

export default WorkspaceView
