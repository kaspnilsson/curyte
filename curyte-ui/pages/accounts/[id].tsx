import React from 'react'
import { LessonStorageModel } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import Container from '../../components/Container'
import LessonPreview from '../../components/LessonPreview'
import * as api from '../../firebase/api'
import SocialLinks from '../../components/SocialLinks'
import Avatar from '../../components/Avatar'

type Props = {
  lessons: LessonStorageModel[]
  author: Author
}

const UserView = ({ lessons, author }: Props) => {
  return (
    <Layout>
      <Container>
        <section className="flex my-8">
          <div className="flex-grow">
            <div className="text-4xl font-bold tracking-tight md:tracking-tighter leading-tight">
              {author.displayName}
            </div>
            <div className="my-4">{author.bio}</div>
            <SocialLinks author={author} />
          </div>
          <div className="ml-12 flex-none">
            <Avatar author={author} className="w-32 h-32" />
          </div>
        </section>
        <h2 className="mb-2 text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight">
          Lessons
        </h2>
        {lessons.map((lesson) => (
          <div className="border-b border-gray-200 pb-8 mb-8" key={lesson.uid}>
            <LessonPreview lesson={lesson} />
          </div>
        ))}
      </Container>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const author = await api.getAuthor(query.id as string)

  const lessons = await api.getLessons([
    { opStr: '==', value: author.uid, fieldPath: 'authorId' },
  ])
  return {
    props: { lessons, author },
  }
}

export default UserView
