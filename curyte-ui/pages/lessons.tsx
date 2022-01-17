import React from 'react'
import { Lesson } from '../interfaces/lesson'
import Layout from '../components/Layout'
import Container from '../components/Container'
import { GetServerSideProps } from 'next'
import { getLessons } from '../firebase/api'
import LessonList from '../components/LessonList'
import { where } from 'firebase/firestore'

interface Props {
  lessons: Lesson[]
}

const SearchPage = ({ lessons }: Props) => {
  return (
    <Layout>
      <Container className="flex flex-col items-center">
        <section className="flex flex-row items-center justify-center mb-8">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter text-center md:text-5xl">
            Open-source curriculum, for the <a href="http://localhost:3000/paths/171f34a8-4130-4c91-ba04-babef48bcaa2" className="italic hover:underline">curious</a>.
          </h1>
        </section>
        {lessons && <LessonList lessons={lessons} allowWrap />}
        {!lessons?.length && 'Nothing here yet! Maybe you should teach us!'}
      </Container>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const lessons = await getLessons([
    where('featured', '==', true),
    where('private', '==', false),
  ])

  return {
    props: { lessons },
  }
}
export default SearchPage
