import React from 'react'
import { Lesson } from '../interfaces/lesson'
import Layout from '../components/Layout'
import Container from '../components/Container'
import { Input } from '@chakra-ui/react'
import { useFuzzy } from '../hooks/useFuzzy'
import { GetServerSideProps } from 'next'
import { getLessons } from '../firebase/api'
import LessonList from '../components/LessonList'

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

const SearchPage = ({ lessons }: Props) => {
  const { result, keyword, search } = useFuzzy<Lesson>(lessons, fuseOptions)

  return (
    <Layout>
      <Container className="flex flex-col items-center">
        <section className="flex flex-row items-center justify-center mb-8">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter text-center md:text-6xl">
            Byte-sized lessons, for the curious.
          </h1>
        </section>
        <section className="flex flex-col items-center justify-around mb-8 w-96">
          <Input
            type="text"
            size="lg"
            className="mx-96"
            variant="outline"
            placeholder="Search for a lesson..."
            value={keyword}
            onChange={(e) => search(e.target.value)}
          />
        </section>
        {result && <LessonList lessons={result} />}
        {!result?.length && 'Nothing here yet! Maybe you should teach us!'}
      </Container>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const lessons = await getLessons([])

  return {
    props: { lessons },
  }
}
export default SearchPage
