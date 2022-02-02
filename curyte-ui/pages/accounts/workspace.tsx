/* eslint-disable react/jsx-filename-extension */
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Layout from '../../components/Layout'
import { auth } from '../../firebase/clientApp'
import { Author } from '../../interfaces/author'
import {
  Button,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Lesson } from '../../interfaces/lesson'
import { useErrorHandler } from 'react-error-boundary'
import {
  indexRoute,
  newLessonRoute,
  newLessonRouteHref,
  newPathRoute,
  workspaceRoute,
} from '../../utils/routes'
import { getAuthor, getLessons, getPaths } from '../../firebase/api'
import LessonList from '../../components/LessonList'
import { where } from 'firebase/firestore'
import { Path } from '../../interfaces/path'
import PathPreview from '../../components/PathPreview'
import Link from 'next/link'
import {
  AcademicCapIcon,
  DocumentTextIcon,
  SupportIcon,
} from '@heroicons/react/outline'

const WorkspaceView = () => {
  const router = useRouter()
  const handleError = useErrorHandler()

  const [user, userLoading] = useAuthState(auth)
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(userLoading)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [paths, setPaths] = useState<Path[]>([])
  const [savedLessons, setSavedLessons] = useState<Lesson[]>([])

  useEffect(() => {
    if (!user && !userLoading) router.push(indexRoute)
  }, [user, userLoading, router])

  useEffect(() => {
    if (user && !author) {
      setLoading(true)
      const fetchAuthor = async () => {
        await getAuthor(user.uid)
          .then((author) => {
            setAuthor(author)
            if (author.savedLessons?.length) {
              return getLessons([where('uid', 'in', author.savedLessons || [])])
                .then((res) => {
                  res.sort(
                    (a, b) =>
                      // author.savedLessons has oldest saves first
                      (author.savedLessons || []).indexOf(b.uid) -
                      (author.savedLessons || []).indexOf(a.uid)
                  )
                  setSavedLessons(res)
                })
                .catch(handleError)
            }
          })
          .catch(handleError)
      }

      const fetchLessons = async () => {
        getLessons([where('authorId', '==', user.uid)]).then((res) => {
          // TODO(kasper): support sorting
          setLessons(res.sort((a, b) => b.updated.localeCompare(a.updated)))
        })
      }

      const fetchPaths = async () => {
        getPaths([where('authorId', '==', user.uid)]).then((res) =>
          // TODO(kasper): support sorting
          setPaths(
            res.sort((a, b) =>
              (b.updated || b.created || '').localeCompare(
                a.updated || a.created || ''
              )
            )
          )
        )
      }

      Promise.all([fetchLessons(), fetchAuthor(), fetchPaths()]).then(() =>
        setLoading(false)
      )
    }
  }, [author, handleError, loading, user])

  return (
    <>
      {loading && <LoadingSpinner />}
      {!user && !userLoading && <ErrorPage statusCode={404} />}
      {author && !loading && (
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
                <Link href="https://discord.gg/Axd7QgGYF9" passHref>
                  <Button className="flex items-center gap-1 mt-4">
                    Get help
                    <SupportIcon className="w-5 h-5" />
                  </Button>
                </Link>
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
                <Tab>Bookmarks</Tab>
              </TabList>
              <TabPanels>
                <TabPanel className="!px-0">
                  {!lessons.length && (
                    <div className="flex flex-col items-start gap-2">
                      Nothing here yet!
                    </div>
                  )}
                  {!!lessons.length && <LessonList lessons={lessons} />}
                </TabPanel>
                <TabPanel className="!px-0">
                  {!paths.length && <div className="">Nothing here yet!</div>}
                  {!!paths.length && (
                    <div className="flex flex-wrap w-full gap-12">
                      {paths.map((p) => (
                        <PathPreview path={p} key={p.uid} author={author} />
                      ))}
                    </div>
                  )}
                </TabPanel>
                <TabPanel className="!px-0">
                  {!savedLessons.length && <div>Nothing here yet!</div>}
                  {!!savedLessons.length && (
                    <LessonList lessons={savedLessons} />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </Layout>
      )}
    </>
  )
}

export default WorkspaceView
