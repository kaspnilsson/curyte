/* eslint-disable react/jsx-filename-extension */
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import AuthorLink from '../../components/AuthorLink'
import Layout from '../../components/Layout'
import { auth } from '../../firebase/clientApp'
import { Author } from '../../interfaces/author'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Input,
  Textarea,
} from '@chakra-ui/react'
import TextareaAutosize from 'react-textarea-autosize'
import LoadingSpinner from '../../components/LoadingSpinner'
import DraftsList from '../../components/DraftsList'
import { Lesson } from '../../interfaces/lesson'
import { useErrorHandler } from 'react-error-boundary'
import {
  indexRoute,
  newLessonRoute,
  newLessonRouteHref,
  newPathRoute,
} from '../../utils/routes'
import {
  getAuthor,
  getLessons,
  getPaths,
  updateAuthor,
} from '../../firebase/api'
import LessonList from '../../components/LessonList'
import { where } from 'firebase/firestore'
import { Path } from '../../interfaces/path'
import PathPreview from '../../components/PathPreview'
import Link from 'next/link'

const MySettingsView = () => {
  const router = useRouter()
  const handleError = useErrorHandler()

  const [user, userLoading] = useAuthState(auth)
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(userLoading)
  const [saving, setSaving] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [paths, setPaths] = useState<Path[]>([])
  const [savedLessons, setSavedLessons] = useState<Lesson[]>([])
  const [authorChanged, setAuthorChanged] = useState(false)

  const modifyAuthor = (a: Author) => {
    setAuthorChanged(true)
    setAuthor(a)
  }

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
        getLessons([
          where('authorId', '==', user.uid),
        ]).then((res) => {
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

  const handleSave = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!author) return
    setSaving(true)
    await updateAuthor(author)
    setSaving(false)
  }

  const handleDelete = async (event: SyntheticEvent) => {
    event.preventDefault()
    setSaving(true)
    await auth.currentUser?.delete()
    setSaving(false)
    router.push(indexRoute)
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!user && !userLoading && <ErrorPage statusCode={404} />}
      {author && !loading && (
        <Layout>
          {saving && <LoadingSpinner />}
          <div className="pb-4">
            <AuthorLink author={author}></AuthorLink>
          </div>
          <Tabs colorScheme="zinc">
            <TabList>
              <Tab>Lessons</Tab>
              <Tab>Paths</Tab>
              <Tab>Saved</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <section className="flex flex-col mb-8">
                   <div className="my-5 flex flex-col justify-between items-left">
                    <h2 className="mb-5 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                    Lessons
                    </h2>
                    <div className="flex flex-col items-start gap-2">
                    <Link
                          as={newLessonRoute()}
                          href={newLessonRouteHref}
                          passHref
                        >
                          <Button colorScheme="gray">Create a lesson</Button>
                        </Link>
                    </div>
                    {!lessons.length && (
                      <div className="flex flex-col items-start gap-2">
                        Nothing here yet!
                        <Link
                          as={newLessonRoute()}
                          href={newLessonRouteHref}
                          passHref
                        >
                        </Link>
                      </div>
                    )}
                    {!!lessons.length && (
                      <div className="-mx-8">
                        <LessonList lessons={lessons} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start justify-between gap-2">
                  </div>
                </section>
                {/* <section className="flex flex-col my-8">
                  <div className="flex flex-col justify-between items-left">
                    <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                      Drafts
                    </h2>
                    <DraftsList />
                  </div>
                </section> */}
                </TabPanel>
              <TabPanel>
                <section className="flex flex-col mb-8">
                  <div className="my-5 flex flex-col items-start justify-between gap-2">
                    <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                      Paths
                    </h2>
                    <Link as={newPathRoute} href={newPathRoute} passHref>
                      <Button className="mb-4" colorScheme="gray">Create a path</Button>
                    </Link>
                    {!paths.length && <div className="">Nothing here yet!</div>}
                    {!!paths.length &&
                      paths.map((p) => <PathPreview path={p} key={p.uid} />)}
                  </div>
                </section>
              </TabPanel>
              <TabPanel>
              <section className="flex flex-col">
                  <div className="my-5 flex flex-col justify-between items-left">
                    <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                      Saved
                    </h2>
                    {!savedLessons.length && <div>Nothing here yet!</div>}
                    {!!savedLessons.length && (
                      <div className="-mx-8">
                        <LessonList lessons={savedLessons} />
                      </div>
                    )}
                  </div>
                </section>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Layout>
      )}
    </>
  )
}

export default MySettingsView
