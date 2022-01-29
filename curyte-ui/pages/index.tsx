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
  Button,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import TagList from '../components/TagList'
import { exploreRoute, newLessonRoute } from '../utils/routes'
import useLocalStorage from '../hooks/useLocalStorage'
import Link from 'next/link'
import { XIcon } from '@heroicons/react/outline'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/clientApp'

interface Props {
  featuredLessons: Lesson[]
  recentLessons: Lesson[]
  popularLessons: Lesson[]
  authors: Author[]
  tags: Tag[]
}

const ExplorePage = ({
  featuredLessons,
  recentLessons,
  popularLessons,
  authors,
  tags,
}: Props) => {
  const [showHero, setShowHero] = useLocalStorage('showStartWritingHero', true)
  const [user] = useAuthState(auth)
  return (
    <Layout
      breadcrumbs={[
        {
          href: exploreRoute,
          label: 'Explore',
          as: exploreRoute,
        },
      ]}
      rightContent={
        <div className="w-full">
          <Heading
            className="mb-2 font-bold leading-tight tracking-tighter"
            size="md"
          >
            Trending topics
          </Heading>
          {!!tags?.length && <TagList tags={tags} />}
        </div>
      }
    >
      {(!user || showHero) && (
        <section className="relative flex flex-col items-center p-12 mb-12 rounded-xl bg-zinc-100 group">
          {user && (
            <Button
              onClick={() => setShowHero(false)}
              className="!absolute top-2 right-2 opacity-0 group-hover:opacity-100 ease-in-out transition-all duration-150"
              size="xs"
            >
              <XIcon className="w-5 h-5 text-zinc-500" />
            </Button>
          )}
          <Heading
            className="mb-8 font-bold leading-tight tracking-tighter text-center"
            size="lg"
          >
            A better lesson builder -- for teachers, by teachers.
          </Heading>
          <Link href={newLessonRoute()} passHref>
            <Button
              colorScheme="black"
              onClick={() => setShowHero(false)}
              className="shadow-xl shadow-violet-500/20"
            >
              Start writing
            </Button>
          </Link>
        </section>
      )}
      <section className="flex flex-row">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
          Explore
        </h1>
      </section>
      <div className="w-full pt-2 mt-4">
        <Tabs colorScheme="black" isLazy>
          <TabList>
            <Tab>Featured</Tab>
            <Tab>Popular</Tab>
            <Tab>Recent</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="!px-0">
              {featuredLessons && (
                <LessonList lessons={featuredLessons} authors={authors} />
              )}
              {!featuredLessons?.length && 'Nothing here yet!'}
            </TabPanel>
            <TabPanel className="!px-0">
              {popularLessons && (
                <LessonList lessons={popularLessons} authors={authors} />
              )}
              {!popularLessons?.length && 'Nothing here yet!'}
            </TabPanel>
            <TabPanel className="!px-0">
              {recentLessons && (
                <LessonList lessons={recentLessons} authors={authors} />
              )}
              {!recentLessons?.length && 'Nothing here yet!'}
            </TabPanel>
          </TabPanels>
        </Tabs>
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
export default ExplorePage
