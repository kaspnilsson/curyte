import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import LessonList from '../../components/LessonList'
import TagList from '../../components/TagList'
import { exploreRoute, tagRoute, tagRouteHrefPath } from '../../utils/routes'
import { Tag, Lesson } from '@prisma/client'
import prismaClient from '../../lib/prisma'
import { useUserAndProfile } from '../../contexts/user'
import { updateTag } from '../../lib/apiHelpers'
import { LessonWithProfile } from '../../interfaces/lesson_with_profile'

type Props = {
  tagText: string
  tag: Tag | null
  lessons: LessonWithProfile[] | null
  relatedTags: Tag[]
}

const TagView = ({ lessons, tag, tagText, relatedTags }: Props) => {
  const { userAndProfile } = useUserAndProfile()

  useEffect(() => {
    if (!userAndProfile?.user || !tag) return
    updateTag(tagText, {
      viewCount: { increment: 1 },
    })
  }, [tag, tagText, userAndProfile])

  return (
    <>
      <Layout
        title={tagText}
        breadcrumbs={[
          {
            label: 'Explore',
            href: exploreRoute,
            as: exploreRoute,
          },
          {
            label: tagText,
            href: tagRouteHrefPath,
            as: tagRoute(tagText),
          },
        ]}
        rightContent={
          <div className="w-full">
            <div className="mb-2 text-xl font-bold leading-tight tracking-tighter md:text-2xl">
              Related topics
            </div>
            {!!relatedTags?.length && <TagList tags={relatedTags} />}
            {!relatedTags?.length && (
              <div className="text-sm text-zinc-500">Nothing here yet!</div>
            )}
          </div>
        }
      >
        <section className="flex flex-col">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
            {tagText}
          </h1>
          {tag && (
            <div className="mt-4 text-sm">{tag.viewCount || 0} views</div>
          )}
        </section>
        <div className="flex flex-col flex-wrap md:flex-row">
          <div className="w-full mt-8">
            <h2 className="mb-2 text-xl font-bold leading-tight tracking-tighter md:text-2xl">
              Lessons
            </h2>
            {lessons && <LessonList lessons={lessons} />}
            {!lessons?.length && (
              <div className="text-sm text-zinc-500">Nothing here yet!</div>
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const tagText = query.tag as string
  const [tag = null, lessons = null] = await Promise.all([
    prismaClient.tag.findFirst({ where: { tagText } }),
    // Could also use the lesson IDs from the tag directly
    prismaClient.lesson.findMany({
      where: { tags: { has: tagText }, private: false },
      include: { profiles: true },
    }),
  ])

  const tagNames = (lessons || []).reduce((acc: Set<string>, curr: Lesson) => {
    for (const tagName of curr.tags || []) acc.add(tagName)
    return acc
  }, new Set())

  return {
    props: {
      tag,
      lessons,
      tagText,
      relatedTags: Array.from(tagNames || [])
        .map((tagText) => ({ tagText } as Tag))
        .splice(0, 48),
    },
  }
}

export default TagView
