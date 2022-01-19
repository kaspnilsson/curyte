/* eslint-disable react/jsx-filename-extension */
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import AuthorLink from '../../components/AuthorLink'
import Layout from '../../components/Layout'
import { auth } from '../../firebase/clientApp'
import { Author } from '../../interfaces/author'
import { Button } from '@chakra-ui/react'
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
import { getAuthor, getLessons, getPaths } from '../../firebase/api'
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
          <div className="pb-4">
            <AuthorLink author={author}></AuthorLink>
          </div>
          <section className="flex flex-col mb-8">
            <div className="flex flex-col items-start justify-between gap-2">
              <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                My lessons
              </h2>
              <Link as={newLessonRoute()} href={newLessonRouteHref} passHref>
                <Button>Create a lesson</Button>
              </Link>
              {!lessons.length && (
                <div className="flex flex-col items-start gap-2">
                  Nothing here yet!
                </div>
              )}
              {!!lessons.length && <LessonList lessons={lessons} />}
            </div>
          </section>
          <section className="flex flex-col mb-8">
            <div className="flex flex-col items-start justify-between gap-2">
              <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                My paths
              </h2>
              <Link as={newPathRoute} href={newPathRoute} passHref>
                <Button>Create a path</Button>
              </Link>
              {!paths.length && <div className="">Nothing here yet!</div>}
              {!!paths.length &&
                paths.map((p) => <PathPreview path={p} key={p.uid} />)}
            </div>
          </section>
          <section className="flex flex-col my-8">
            <div className="flex flex-col justify-between items-left">
              <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                Bookmarked lessons
              </h2>
              {!savedLessons.length && <div>Nothing here yet!</div>}
              {!!savedLessons.length && <LessonList lessons={savedLessons} />}
            </div>
          </section>
        </Layout>
      )}
    </>
  )
}

export default MySettingsView
