import React from 'react'
import { Lesson } from '../interfaces/lesson'
import { Tag } from '../interfaces/tag'
import Layout from '../components/Layout'
import { GetServerSideProps } from 'next'
import { getAuthor, getLessons, getTags } from '../firebase/api'
import LessonList from '../components/LessonList'
import { limit, orderBy, where } from 'firebase/firestore'
import { Author } from '../interfaces/author'
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import TagList from '../components/TagList'

interface Props {
  featuredLessons: Lesson[]
  recentLessons: Lesson[]
  popularLessons: Lesson[]
  authors: Author[]
  tags: Tag[]
}

const SearchPage = ({
  featuredLessons,
  recentLessons,
  popularLessons,
  authors,
  tags,
}: Props) => {
  return (
    <Layout>
      <section className="flex flex-row items-center justify-center mb-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter text-center md:text-6xl">
          Open-source curriculum, for the curious.
        </h1>
      </section>
      <div className="flex flex-col flex-wrap md:flex-row md:divide-x">
        <div className="w-full mt-8 md:w-2/3 md:pr-4">
          <Tabs variant="soft-rounded" colorScheme="zinc">
            <TabList>
              <Tab>Featured</Tab>
              <Tab>Popular</Tab>
              <Tab>Recent</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {featuredLessons && (
                  <LessonList lessons={featuredLessons} authors={authors} />
                )}
                {!featuredLessons?.length && 'Nothing here yet!'}
              </TabPanel>
              <TabPanel>
                {popularLessons && (
                  <LessonList lessons={popularLessons} authors={authors} />
                )}
                {!popularLessons?.length && 'Nothing here yet!'}
              </TabPanel>
              <TabPanel>
                {recentLessons && (
                  <LessonList lessons={recentLessons} authors={authors} />
                )}
                {!recentLessons?.length && 'Nothing here yet!'}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
        <div className="w-full mt-8 md:w-1/3 md:pl-8">
          <Heading
            className="mb-2 font-bold leading-tight tracking-tighter"
            size="md"
          >
            Trending topics
          </Heading>
          {!!tags?.length && <TagList tags={tags} />}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const featuredLessons = await getLessons([
    where('featured', '==', true),
    where('private', '==', false),
    limit(10),
  ])

  const popularLessons = await getLessons([
    where('private', '==', false),
    orderBy('viewCount', 'desc'),
    limit(10),
  ])

  const recentLessons = await getLessons([
    where('private', '==', false),
    orderBy('created', 'desc'),
    limit(10),
  ])

  const authorIds = [
    ...featuredLessons,
    ...popularLessons,
    ...recentLessons,
  ].reduce(
    (acc: Set<string>, curr: Lesson) => acc.add(curr.authorId),
    new Set()
  )

  const authors = []
  for (const id of Array.from(authorIds)) {
    authors.push(await getAuthor(id))
  }

  const tags = await getTags([orderBy('viewCount', 'desc'), limit(16)])

  return {
    props: { featuredLessons, popularLessons, recentLessons, authors, tags },
  }
}
export default SearchPage
