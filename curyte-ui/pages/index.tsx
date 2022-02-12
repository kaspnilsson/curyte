import React, { useEffect, useState } from 'react'
import { Lesson } from '../interfaces/lesson'
import { Tag } from '../interfaces/tag'
import Layout from '../components/Layout'
import { GetServerSideProps } from 'next'
import LessonList from '../components/LessonList'
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
import Link from 'next/link'
import { XIcon } from '@heroicons/react/outline'
import supabase from '../supabase/client'
import { getLessons } from './api/lessons'
import { PostgrestResponse, User } from '@supabase/supabase-js'
import { getTags } from './api/tags'
import { getAuthors } from './api/profiles'

interface Props {
  featuredLessons: Lesson[]
  recentLessons: Lesson[]
  popularLessons: Lesson[]
  authors: Author[]
  tags: Tag[]
  user: User | null
}

const ExplorePage = ({
  featuredLessons,
  recentLessons,
  popularLessons,
  authors,
  tags,
  user,
}: Props) => {
  const [showHero, setShowHero] = useState(false)
  useEffect(() => {
    const hideShowHero = localStorage.getItem('hideStartWritingHero')
    setShowHero(!hideShowHero)
  }, [])

  const hideHero = () => {
    setShowHero(false)
    localStorage.setItem('hideStartWritingHero', 'true')
  }

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
        <section className="relative flex flex-col items-center p-12 mb-12 shadow-xl rounded-xl bg-zinc-100 group shadow-violet-500/20">
          {user && (
            <Button
              onClick={hideHero}
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
            <Button colorScheme="black" onClick={hideHero}>
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  const mapLessonFn = (res: PostgrestResponse<unknown>) =>
    (res.body || []).map((data) => data as Lesson)

  const [featuredLessons, popularLessons, recentLessons] = (
    await Promise.all([
      getLessons().eq('featured', true).neq('private', true).limit(10),
      getLessons()
        .neq('private', true)
        .order('viewCount', { ascending: false })
        .limit(10),
      getLessons()
        .neq('private', true)
        .order('created', { ascending: false })
        .limit(10),
    ])
  ).map((res) => mapLessonFn(res))

  const authorIds = [
    ...featuredLessons,
    ...popularLessons,
    ...recentLessons,
  ].reduce(
    (acc: Set<string>, curr: Lesson) => acc.add(curr.authorId),
    new Set()
  )

  const authors = (
    (await getAuthors().in('uid', Array.from(authorIds))).body || []
  ).map((a) => a as Author)

  const tags = (
    (await getTags().order('viewCount', { ascending: false }).limit(16)).body ||
    []
  ).map((t) => t as Tag)

  return {
    props: {
      featuredLessons,
      popularLessons,
      recentLessons,
      authors,
      tags,
      user,
    },
  }
}

export default ExplorePage
