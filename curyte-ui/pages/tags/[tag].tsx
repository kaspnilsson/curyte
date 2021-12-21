import React, { useEffect } from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { Tag } from '../../interfaces/tag'
import { auth } from '../../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import LessonPreview from '../../components/LessonPreview'
import { getLessons, getTag, logTagView } from '../../firebase/api'

type Props = {
  tagText: string
  tag: Tag | null
  lessons: Lesson[] | null
}

const TagView = ({ lessons, tag, tagText }: Props) => {
  // Log views only on render of a published lesson
  const [user, userLoading] = useAuthState(auth)
  useEffect(() => {
    if (!user || userLoading || !tag) return
    logTagView(tagText)
  }, [tag, tagText, user, userLoading])

  return (
    <>
      <Layout showProgressBar title={tagText}>
        <Container>
          <section className="flex flex-col mb-12">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
              {`# ${tagText}`}
            </h1>
            {tag && `${tag.viewCount} views`}
          </section>
          <h2 className="mb-2 text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Lessons
          </h2>
          {lessons && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {lessons.map((lesson) => (
                <LessonPreview key={lesson.uid} lesson={lesson} />
              ))}
            </div>
          )}
          {!lessons?.length && 'No lessons yet!'}
        </Container>
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
      {
        fieldPath: 'tags',
        opStr: 'array-contains',
        value: query.tag as string,
      },
    ]),
  ])
  return {
    props: { tag, lessons, tagText },
  }
}

export default TagView
