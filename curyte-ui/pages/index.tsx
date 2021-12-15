import React from 'react'
import { Lesson } from '../interfaces/lesson'
import Layout from '../components/Layout'
import Container from '../components/Container'
import LessonPreview from '../components/LessonPreview'
import { Input } from '@chakra-ui/react'
import { useFuzzy } from '../hooks/useFuzzy'
import * as api from '../firebase/api'
import { GetServerSideProps } from 'next'

const fuseOptions = {
  distance: 10000,
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'tags', weight: 0.3 },
    { name: 'description', weight: 0.2 },
  ],
}

interface Props {
  lessons: Lesson[]
}

const Home = ({ lessons }: Props) => {
  const { result, keyword, search } = useFuzzy<Lesson>(lessons, fuseOptions)

  return (
    <>
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
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const lessons = await api.getLessons([])

  return {
    props: { lessons },
  }
}
export default Home
