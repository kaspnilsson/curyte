import React, { useEffect } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Tag } from '../../interfaces/tag'
import { auth } from '../../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuthor, getLessons, getTag, logTagView } from '../../firebase/api'
import LessonList from '../../components/LessonList'
import { where } from 'firebase/firestore'
import { Author } from '../../interfaces/author'
import TagList from '../../components/TagList'
import { Heading } from '@chakra-ui/react'

type Props = {
  tagText: string
  tag: Tag | null
  lessons: Lesson[] | null
  authors: Author[]
  relatedTags: Tag[]
}

const TagView = ({ lessons, tag, tagText, authors, relatedTags }: Props) => {
  const [user, userLoading] = useAuthState(auth)
  useEffect(() => {
    if (!user || userLoading || !tag) return
    logTagView(tagText)
  }, [tag, tagText, user, userLoading])

  return (
    <>
      <Layout showProgressBar title={tagText}>
        <section className="flex flex-col">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
            {tagText}
          </h1>
          {tag && (
            <div className="mt-4 text-sm">{tag.viewCount || 0} views</div>
          )}
        </section>
        <div className="flex flex-col flex-wrap md:flex-row">
          <div className="w-full mt-8 md:w-2/3 md:pr-8">
            <h2 className="mb-2 text-xl font-bold leading-tight tracking-tighter md:text-2xl">
              Lessons
            </h2>
            {lessons && <LessonList lessons={lessons} authors={authors} />}
            {!lessons?.length && 'Nothing here yet!'}
          </div>
          <div className="w-full mt-8 md:w-1/3 md:pl-8">
            <Heading
              className="mb-2 font-bold leading-tight tracking-tighter"
              size="md"
            >
              Related topics
            </Heading>
            {!!relatedTags?.length && <TagList tags={relatedTags} />}
            {!relatedTags?.length && 'Nothing here yet!'}
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
