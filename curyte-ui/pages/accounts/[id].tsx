import React from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import SocialLinks from '../../components/SocialLinks'
import Avatar from '../../components/Avatar'
import { getAuthor, getLessons } from '../../firebase/api'
import LessonList from '../../components/LessonList'
import { where } from 'firebase/firestore'

type Props = {
  lessons: Lesson[]
  author: Author
}

const UserView = ({ lessons, author }: Props) => {
  return (
    <Layout title={author.displayName || 'Author page'}>
      <section className="flex my-8">
        <div className="flex-grow">
          <div className="text-4xl font-bold leading-tight tracking-tight">
            {author.displayName}
          </div>
          <div className="my-4">{author.bio}</div>
          <SocialLinks author={author} />
        </div>
        <div className="flex-none ml-12">
          <Avatar author={author} size="2xl" />
        </div>
      </section>
      <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight md:text-2xl">
        Lessons
      </h2>
      {!!lessons.length && (
        <div className="flex flex-wrap justify-center gap-4 mb-8 -mx-8">
          <LessonList lessons={lessons} />
        </div>
      )}
      {!lessons?.length && 'Nothing here yet!'}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const author = await getAuthor(query.id as string)

  const lessons = await getLessons([
    where('authorId', '==', author.uid),
    where('private', '==', false),
  ])
  return {
    props: { lessons, author },
  }
}

export default UserView
