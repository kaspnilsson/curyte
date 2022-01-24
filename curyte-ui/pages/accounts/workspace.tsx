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
} from '../../utils/routes'
import { getAuthor, getLessons, getPaths } from '../../firebase/api'
import LessonList from '../../components/LessonList'
import { where } from 'firebase/firestore'
import { Path } from '../../interfaces/path'
import PathPreview from '../../components/PathPreview'
import Link from 'next/link'
import { AcademicCapIcon, DocumentTextIcon } from '@heroicons/react/outline'

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
          setLessons(res)
        })
      }

      const fetchPaths = async () => {
        getPaths([where('authorId', '==', user.uid)]).then((res) =>
          setPaths(res)
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
        <Layout>
          <section className="flex flex-row items-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter text-center md:text-6xl">
              Workspace
            </h1>
          </section>
          <div className="flex flex-col flex-wrap md:flex-row md:divide-x">
            <div className="w-full pt-2 mt-4 md:w-2/3 md:pr-8">
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
                    {!!paths.length &&
                      paths.map((p) => (
                        <PathPreview path={p} key={p.uid} author={author} />
                      ))}
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
            <div className="w-full mt-8 md:w-1/3 md:pl-8">
              <Heading
                className="mb-2 font-bold leading-tight tracking-tighter"
                size="md"
              >
                Create
              </Heading>
              <div className="flex flex-col items-start gap-2">
                <Link as={newLessonRoute()} href={newLessonRouteHref} passHref>
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
            </div>
          </div>
        </Layout>
      )}
    </>
  )
}

export default WorkspaceView
