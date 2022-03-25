import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { GetServerSideProps } from 'next'
import LessonList from '../components/LessonList'
import {
  Button,
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
import { Tag } from '@prisma/client'
import prismaClient from '../lib/prisma'
import { useUserAndProfile } from '../contexts/user'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import LoadingSpinner from '../components/LoadingSpinner'

interface Props {
  featuredLessons: LessonWithProfile[]
  recentLessons: LessonWithProfile[]
  popularLessons: LessonWithProfile[]
  tags: Tag[]
}

const ExplorePage = ({
  featuredLessons,
  recentLessons,
  popularLessons,
  tags,
}: Props) => {
  const [showHero, setShowHero] = useState(false)

  const { userAndProfile, loading } = useUserAndProfile()

  useEffect(() => {
    const hideShowHero = localStorage.getItem('hideStartWritingHero')
    setShowHero(!hideShowHero)
  }, [])

  const hideHero = () => {
    setShowHero(false)
    localStorage.setItem('hideStartWritingHero', 'true')
  }

  if (loading) return <LoadingSpinner />

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
          <span className="mb-2 text-2xl font-bold leading-tight tracking-tighter">
            Trending topics
          </span>
          {!!tags?.length && <TagList tags={tags} />}
        </div>
      }
    >
      {(!userAndProfile || showHero) && (
        <section className="relative flex flex-col items-center p-12 mb-12 shadow-xl rounded-xl bg-zinc-100 group shadow-violet-500/20">
          {userAndProfile && (
            <Button
              onClick={hideHero}
              className="!absolute top-2 right-2 opacity-0 group-hover:opacity-100 ease-in-out transition-all duration-150"
              size="xs"
            >
              <XIcon className="w-5 h-5 text-zinc-500" />
            </Button>
          )}
          <span className="mb-8 text-4xl font-bold leading-tight tracking-tighter text-center">
            A better lesson builder -- for teachers, by teachers.
          </span>
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
              {featuredLessons && <LessonList lessons={featuredLessons} />}
              {!featuredLessons?.length && (
                <div className="text-sm text-zinc-500">Nothing here yet!</div>
              )}
            </TabPanel>
            <TabPanel className="!px-0">
              {popularLessons && <LessonList lessons={popularLessons} />}
              {!popularLessons?.length && (
                <div className="text-sm text-zinc-500">Nothing here yet!</div>
              )}
            </TabPanel>
            <TabPanel className="!px-0">
              {recentLessons && <LessonList lessons={recentLessons} />}
              {!recentLessons?.length && (
                <div className="text-sm text-zinc-500">Nothing here yet!</div>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [featuredLessons, popularLessons, recentLessons] = await Promise.all([
    prismaClient.lesson.findMany({
      take: 10,
      include: { profiles: true },
      where: { featured: true, private: { not: true } },
      orderBy: { updated: 'desc' },
    }),
    prismaClient.lesson.findMany({
      take: 10,
      include: { profiles: true },
      where: { private: { not: true } },
      orderBy: { viewCount: 'desc' },
    }),
    prismaClient.lesson.findMany({
      take: 10,
      include: { profiles: true },
      where: { private: { not: true } },
      orderBy: { created: 'desc' },
    }),
  ])

  const tags = await prismaClient.tag.findMany({
    take: 16,
    orderBy: { viewCount: 'desc' },
  })
  return {
    props: { featuredLessons, popularLessons, recentLessons, tags },
  }
}

export default ExplorePage
