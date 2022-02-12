import React, { useEffect } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Tag } from '../../interfaces/tag'
import { getAuthor, getLessons, getTag, logTagView } from '../../firebase/api'
import LessonList from '../../components/LessonList'
import { where } from 'firebase/firestore'
import { Author } from '../../interfaces/author'
import TagList from '../../components/TagList'
import { Heading } from '@chakra-ui/react'
import { exploreRoute, tagRoute, tagRouteHrefPath } from '../../utils/routes'
import supabase from '../../supabase/client'

type Props = {
  tagText: string
  tag: Tag | null
  lessons: Lesson[] | null
  authors: Author[]
  relatedTags: Tag[]
}

const TagView = ({ lessons, tag, tagText, authors, relatedTags }: Props) => {
  const user = supabase.auth.user()
  useEffect(() => {
    if (!user || !tag) return
    logTagView(tagText)
  }, [tag, tagText, user])

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
            <Heading
              className="mb-2 font-bold leading-tight tracking-tighter"
              size="md"
            >
              Related topics
            </Heading>
            {!!relatedTags?.length && <TagList tags={relatedTags} />}
            {!relatedTags?.length && 'Nothing here yet!'}
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
            {lessons && <LessonList lessons={lessons} authors={authors} />}
            {!lessons?.length && 'Nothing here yet!'}
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const tagText = query.tag as string
  const [tag = null, lessons = null] = await Promise.all([
    getTag(query.tag as string),
    // Could also use the lesson IDs from the tag directly
    getLessons([
      where('tags', 'array-contains', query.tag as string),
      where('private', '==', false),
    ]),
  ])

  const authorIds = (lessons || []).reduce(
    (acc: Set<string>, curr: Lesson) => acc.add(curr.authorId),
    new Set()
  )

  const authors = []
  for (const id of Array.from(authorIds)) {
    authors.push(await getAuthor(id))
  }

  const tagNames = (lessons || []).reduce((acc: Set<string>, curr: Lesson) => {
    for (const tagName of curr.tags || []) acc.add(tagName)
    return acc
  }, new Set())

  return {
    props: {
      tag,
      lessons,
      tagText,
      authors,
      relatedTags: Array.from(tagNames || [])
        .map((tagText) => ({ tagText } as Tag))
        .splice(0, 48),
    },
  }
}

export default TagView
