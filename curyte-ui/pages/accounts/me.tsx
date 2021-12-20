/* eslint-disable react/jsx-filename-extension */
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import AuthorLink from '../../components/AuthorLink'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import firebase from '../../firebase/clientApp'
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
import * as api from '../../firebase/api'
import DraftsPage from '../drafts/all'
import { Lesson } from '../../interfaces/lesson'
import LessonPreview from '../../components/LessonPreview'
import { useErrorHandler } from 'react-error-boundary'

const MySettingsView = () => {
  const router = useRouter()
  const handleError = useErrorHandler()

  const [user, userLoading] = useAuthState(firebase.auth())
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(userLoading)
  const [saving, setSaving] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [savedLessons, setSavedLessons] = useState<Lesson[]>([])
  const [authorChanged, setAuthorChanged] = useState(false)

  const modifyAuthor = (a: Author) => {
    setAuthorChanged(true)
    setAuthor(a)
  }

  useEffect(() => {
    if (!user && !userLoading) router.push('/')
  }, [user, userLoading, router])

  useEffect(() => {
    if (user && !author) {
      setLoading(true)
      const fetchAuthor = async () => {
        await api
          .getAuthor(user.uid)
          .then((author) => {
            setAuthor(author)
            if (author.savedLessons?.length) {
              return api
                .getLessons([
                  {
                    fieldPath: 'uid',
                    opStr: 'in',
                    value: author.savedLessons || [],
                  },
                ])
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
        api
          .getLessons([{ fieldPath: 'authorId', opStr: '==', value: user.uid }])
          .then((res) => {
            setLessons(res)
          })
      }

      Promise.all([fetchLessons(), fetchAuthor()]).then(() => setLoading(false))
    }
  }, [author, handleError, loading, user])

  const handleSave = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!author) return
    setSaving(true)
    await api.updateAuthor(author)
    setSaving(false)
  }

  const handleDelete = async (event: SyntheticEvent) => {
    event.preventDefault()
    setSaving(true)
    await firebase.auth().currentUser?.delete()
    setSaving(false)
    router.push('/')
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!user && !userLoading && <ErrorPage statusCode={404} />}
      {author && !loading && (
        <Layout>
          {saving && <LoadingSpinner />}
          <Container>
            <div className="pb-4">
              <AuthorLink author={author}></AuthorLink>
            </div>
            <Tabs colorScheme="purple">
              <TabList>
                <Tab>Posts</Tab>
                <Tab>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <section className="flex flex-col my-8">
                    <div className="flex items-left justify-between flex-col">
                      <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight leading-tight">
                        Lessons
                      </h2>
                      {!lessons.length && 'Nothing here yet!'}
                      <div className="flex flex-wrap gap-4 mb-8 justify-center">
                        {lessons.map((lesson) => (
                          <LessonPreview key={lesson.uid} lesson={lesson} />
                        ))}
                      </div>
                    </div>
                  </section>
                  <section className="flex flex-col my-8">
                    <div className="flex items-left justify-between flex-col">
                      <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight leading-tight">
                        Saved
                      </h2>
                      {!savedLessons.length && 'Nothing here yet!'}
                      <div className="flex flex-wrap gap-4 mb-8 justify-center">
                        {savedLessons.map((lesson) => (
                          <LessonPreview key={lesson.uid} lesson={lesson} />
                        ))}
                      </div>
                    </div>
                  </section>
                  <section className="flex flex-col my-8">
                    <div className="flex items-left justify-between flex-col">
                      <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight leading-tight">
                        Drafts
                      </h2>
                      <DraftsPage />
                    </div>
                  </section>
                </TabPanel>
                <TabPanel>
                  <section className="flex flex-col my-8">
                    <div className="flex items-center justify-between">
                      <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight leading-tight">
                        Profile settings
                      </h2>
                      <Button
                        colorScheme="purple"
                        className="w-fit-content disabled:opacity-50"
                        onClick={handleSave}
                        disabled={!authorChanged}
                      >
                        Save
                      </Button>
                    </div>
                    <div className="my-2">
                      <h3 className="font-bold tracking-tight leading-tight">
                        Bio
                      </h3>
                      <Textarea
                        as={TextareaAutosize}
                        className="resize-none mt-1 w-full border-0"
                        placeholder="Bio"
                        value={author.bio}
                        onChange={(e) =>
                          modifyAuthor({ ...author, bio: e.target.value })
                        }
                      />
                    </div>
                    <div className="my-2">
                      <h3 className="font-bold tracking-tight leading-tight">
                        Username
                      </h3>
                      <Input
                        type="text"
                        size="lg"
                        variant="outline"
                        placeholder="Username"
                        value={author.username}
                        onChange={(e) =>
                          modifyAuthor({ ...author, username: e.target.value })
                        }
                      />
                    </div>
                  </section>
                  <section className="flex flex-col my-8">
                    <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight leading-tight">
                      Email settings
                    </h2>
                    <div className="my-2">
                      <h3 className="font-bold tracking-tight leading-tight">
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
                    <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight leading-tight">
                      Links
                    </h2>
                    <div className="my-2">
                      <h3 className="font-bold tracking-tight leading-tight">
                        Twitter
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
                      <h3 className="font-bold tracking-tight leading-tight">
                        LinkedIn
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
                      <h3 className="font-bold tracking-tight leading-tight">
                        Personal website
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
                      <h3 className="font-bold tracking-tight leading-tight">
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
                      <h3 className="font-bold tracking-tight leading-tight">
                        Venmo
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
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Layout>
      )}
    </>
  )
}

export default MySettingsView
