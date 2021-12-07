// index.tsx
import firebase from '../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState } from 'react'
import { Lesson } from '../interfaces/lesson'
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
    { name: 'title', weight: 0.4 },
    { name: 'tags', weight: 0.3 },
    { name: 'description', weight: 0.2 },
  ],
}

const Home = () => {
  const [, userLoading] = useAuthState(firebase.auth())
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(userLoading)

  useEffect(() => {
    setLoading(true)

    api.getLessons([]).then((res) => {
      setLoading(false)
      setLessons(res)
    })
  }, [])

  const { result, keyword, search } = useFuzzy<Lesson>(lessons, fuseOptions)

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
              <section className="flex-col flex items-center justify-around mb-8">
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
              </section>
              {result &&
                result.map((lesson) => (
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
