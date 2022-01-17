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
                <section className="flex flex-col my-8">
                  <div className="flex items-center justify-between">
                    <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                      Profile settings
                    </h2>
                    <Button
                      colorScheme="black"
                      className="w-fit-content disabled:opacity-50"
                      onClick={handleSave}
                      disabled={!authorChanged}
                    >
                      Save
                    </Button>
                  </div>
                  <div className="my-2">
                    <h3 className="font-bold leading-tight tracking-tight">
                      Name
                    </h3>
                    <Input
                      type="text"
                      size="lg"
                      variant="outline"
                      placeholder="Full name"
                      value={author.displayName}
                      onChange={(e) =>
                        modifyAuthor({
                          ...author,
                          displayName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="my-2">
                    <h3 className="font-bold leading-tight tracking-tight">
                      Bio
                    </h3>
                    <Textarea
                      as={TextareaAutosize}
                      className="w-full mt-1 border-0 resize-none"
                      placeholder="Bio"
                      value={author.bio}
                      onChange={(e) =>
                        modifyAuthor({ ...author, bio: e.target.value })
                      }
                    />
                  </div>
                </section>
                <section className="flex flex-col my-8">
                  <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                    Email settings
                  </h2>
                  <div className="my-2">
                    <h3 className="font-bold leading-tight tracking-tight">
                      Email address
                    </h3>
                    <Input
                      type="text"
                      size="lg"
                      variant="outline"
                      placeholder="Email"
                      value={author.email}
                      onChange={(e) =>
                        modifyAuthor({ ...author, email: e.target.value })
                      }
                    />
                  </div>
                </section>
                <section className="flex flex-col my-8">
                  <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight md:text-2xl">
                    Links
                  </h2>
                  <div className="my-2">
                    <h3 className="font-bold leading-tight tracking-tight">
                      Twitter profile URL
                    </h3>
                    <Input
                      type="text"
                      size="lg"
                      variant="outline"
                      placeholder="Leave blank to remove from public profile."
                      value={author.links?.twitter || ''}
                      onChange={(e) =>
                        modifyAuthor({
                          ...author,
                          links: { ...author.links, twitter: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="my-2">
                    <h3 className="font-bold leading-tight tracking-tight">
                      LinkedIn profile URL
                    </h3>
                    <Input
                      type="text"
                      size="lg"
                      variant="outline"
                      placeholder="Leave blank to remove from public profile."
                      value={author.links?.linkedin || ''}
                      onChange={(e) =>
                        modifyAuthor({
                          ...author,
                          links: {
                            ...author.links,
                            linkedin: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="my-2">
                    <h3 className="font-bold leading-tight tracking-tight">
                      Personal website URL
                    </h3>
                    <Input
                      type="text"
                      size="lg"
                      variant="outline"
                      placeholder="Leave blank to remove from public profile."
                      value={author.links?.personalSite || ''}
                      onChange={(e) =>
                        modifyAuthor({
                          ...author,
                          links: {
                            ...author.links,
                            personalSite: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="my-2">
                    <h3 className="font-bold leading-tight tracking-tight">
                      Public email
                    </h3>
                    <Input
                      type="text"
                      size="lg"
                      variant="outline"
                      placeholder="Leave blank to remove from public profile."
                      value={author.links?.publicEmail || ''}
                      onChange={(e) =>
                        modifyAuthor({
                          ...author,
                          links: {
                            ...author.links,
                            publicEmail: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="my-2">
                    <h3 className="font-bold leading-tight tracking-tight">
                      Venmo URL
                    </h3>
                    <Input
                      type="text"
                      size="lg"
                      variant="outline"
                      placeholder="Leave blank to remove from public profile."
                      value={author.links?.venmo || ''}
                      onChange={(e) =>
                        modifyAuthor({
                          ...author,
                          links: {
                            ...author.links,
                            venmo: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </section>
                <section className="my-8">
                  <Button color="red" className="w-56" onClick={handleDelete}>
                    Delete account
                  </Button>
                </section>
        </Layout>
      )}
    </>
  )
}

export default MySettingsView
