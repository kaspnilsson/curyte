import React from 'react'
import { Lesson } from '../interfaces/lesson'
import { Tag } from '../interfaces/tag'
import Layout from '../components/Layout'
import { GetServerSideProps } from 'next'
import { getAuthor, getLessons, getTags } from '../firebase/api'
import LessonList from '../components/LessonList'
import { limit, orderBy, where } from 'firebase/firestore'
import { Author } from '../interfaces/author'
import { Heading } from '@chakra-ui/react'
import TagChip from '../components/TagChip'

interface Props {
  lessons: Lesson[]
  authors: Author[]
  tags: Tag[]
}

const SearchPage = ({ lessons, authors, tags }: Props) => {
  return (
    <Layout>
      <section className="flex flex-row items-center justify-center mb-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter text-center md:text-6xl">
          Open-source curriculum, for the curious.
        </h1>
      </section>
      <div className="flex flex-col flex-wrap md:flex-row md:divide-x">
        <div className="w-full mt-8 md:w-2/3 md:pr-8">
          {lessons && <LessonList lessons={lessons} authors={authors} />}
          {!lessons?.length && 'Nothing here yet! Maybe you should teach us!'}
        </div>
        <div className="w-full mt-8 md:w-1/3 md:pl-8">
          <Heading
            className="mb-8 font-bold leading-tight tracking-tighter"
            size="md"
          >
            Trending topics
          </Heading>
          {!!tags?.length && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t, index) => (
                <TagChip tagLabel={t.tagText} key={index} size="lg" />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const lessons = await getLessons([
    where('featured', '==', true),
    where('private', '==', false),
  ])

  const authorIds = lessons.reduce(
    (acc: Set<string>, curr: Lesson) => acc.add(curr.authorId),
    new Set()
  )

  const authors = []
  for (const id of Array.from(authorIds)) {
    authors.push(await getAuthor(id))
  }

  const tags = await getTags([orderBy('viewCount', 'desc'), limit(10)])

  return {
    props: { lessons, authors, tags },
  }
}
export default SearchPage
