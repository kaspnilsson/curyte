import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import SocialLinks from '../../components/SocialLinks'
import Avatar from '../../components/Avatar'
import LessonList from '../../components/LessonList'
import { Heading } from '@chakra-ui/react'
import TagList from '../../components/TagList'
import { accountRouteHrefPath, accountRoute } from '../../utils/routes'
import { Lesson, Profile, Tag } from '@prisma/client'
import ErrorPage from 'next/error'
import prismaClient from '../../lib/prisma'
import { LessonWithProfile } from '../../interfaces/lesson_with_profile'

type Props = {
  lessons: LessonWithProfile[]
  profile: Profile | null
  favoriteTags: Tag[]
}

const UserView = ({ lessons, profile, favoriteTags }: Props) => {
  if (!profile) return <ErrorPage statusCode={404} />
  return (
    <Layout
      title={profile.displayName || 'Author page'}
      breadcrumbs={[
        {
          label: profile.displayName + "'s page",
          href: accountRouteHrefPath,
          as: accountRoute(profile.uid),
        },
      ]}
    >
      <section className="flex mb-8">
        <div className="flex-grow">
          <div className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
            {profile.displayName}
          </div>
          <div className="my-4">{profile.bio}</div>
          <SocialLinks profile={profile} />
        </div>
        <div className="flex-none ml-12">
          <Avatar profile={profile} size="2xl" />
        </div>
      </section>
      <div className="flex flex-col flex-wrap md:flex-row">
        <div className="w-full md:w-2/3 md:pr-8">
          <h2 className="text-xl font-bold leading-tight tracking-tighter md:text-2xl">
            Lessons
          </h2>
          {lessons && <LessonList lessons={lessons} />}
          {!lessons?.length && (
            <div className="text-sm text-zinc-500">Nothing here yet!</div>
          )}
        </div>
        <div className="w-full md:w-1/3 md:pl-8">
          <Heading
            className="mb-4 font-bold leading-tight tracking-tighter"
            size="md"
          >
            Favorite topics
          </Heading>
          {!!favoriteTags?.length && <TagList tags={favoriteTags} />}
          {!favoriteTags?.length && (
            <div className="text-sm text-zinc-500">Nothing here yet!</div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const profile = await prismaClient.profile.findFirst({
    where: { uid: query.id as string },
  })

  const lessons = profile?.uid
    ? await prismaClient.lesson.findMany({
        where: { authorId: profile.uid, private: { not: true } },
        include: { profiles: true },
      })
    : []

  const tagCounts = (lessons || []).reduce(
    (acc: { [tagName: string]: number }, curr: Lesson) => {
      for (const tagName of curr.tags || []) {
        acc[tagName] ? acc[tagName]++ : (acc[tagName] = 1)
      }
      return acc
    },
    {}
  )

  const favoriteTags = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .map((tagText) => ({ tagText } as Tag))
    .splice(0, 16)

  return {
    props: {
      lessons,
      profile,
      favoriteTags,
    },
  }
}

export default UserView
