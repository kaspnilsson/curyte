// index.tsx
import firebase from '../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState } from 'react'
import { LessonStorageModel } from '../interfaces/lesson'
import Layout from '../components/Layout'
import Container from '../components/Container'
import LessonPreview from '../components/LessonPreview'
import LoadingSpinner from '../components/LoadingSpinner'
import { Input } from '@chakra-ui/react'
import { useFuzzy } from '../hooks/useFuzzy'
import * as api from '../firebase/api'

const fuseOptions = {
  distance: 10000,
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'sections.title', weight: 0.15 },
    { name: 'sections.content', weight: 0.05 },
  ],
}

const Home = () => {
  const [user, userLoading] = useAuthState(firebase.auth())
  const [lessons, setLessons] = useState<LessonStorageModel[]>([])
  const [loading, setLoading] = useState(userLoading)

  useEffect(() => {
    if (!user) return
    setLoading(true)

    api
      .getLessons([{ fieldPath: 'published', opStr: '==', value: true }])
      .then((res) => {
        setLoading(false)
        setLessons(res)
      })
  }, [user])

  const { result, keyword, search } = useFuzzy<LessonStorageModel>(
    lessons,
    fuseOptions
  )

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Layout>
            <Container>
              <section className="flex-row flex items-center justify-center mt-16 mb-8">
                <h1 className="text-4xl md:text-6xl text-center font-bold tracking-tighter leading-tight">
                  Curriculum for the digital age.
                </h1>
              </section>
              <section className="flex-col flex items-center justify-around">
                {/* <p className="text-center tracking-tighter mb-8 text-gray-700">
                  Because lessons can be so much more than just PDFs from the
                  90s.
                </p> */}

                <Input
                  type="text"
                  size="lg"
                  variant="outline"
                  placeholder="Search for a lesson..."
                  value={keyword}
                  onChange={(e) => search(e.target.value)}
                />
                {/* {user ? null : (
                  <Link href="/login" passHref>
                    <Button
                      className="font-semibold py-2 px-4 "
                      variant="outline"
                    >
                      Get started
                    </Button>
                  </Link>
                )} */}
              </section>
              {result.map((lesson) => (
                <div
                  className="border-b border-gray-200 pb-8 mb-8"
                  key={lesson.uid}
                >
                  <LessonPreview lesson={lesson} />
                </div>
              ))}
            </Container>
          </Layout>
        </>
      )}
    </>
  )
}

export default Home
