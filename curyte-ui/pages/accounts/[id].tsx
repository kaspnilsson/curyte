import React from 'react'
import { Lesson } from '../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import Layout from '../../components/Layout'
import { Author } from '../../interfaces/author'
import SocialLinks from '../../components/SocialLinks'
import Avatar from '../../components/Avatar'
import { getAuthor, getLessons } from '../../firebase/api'
import LessonList from '../../components/LessonList'
import { where } from 'firebase/firestore'
import { Tag } from '../../interfaces/tag'
import { Heading } from '@chakra-ui/react'
import TagList from '../../components/TagList'
import { accountRouteHrefPath, accountRoute } from '../../utils/routes'

type Props = {
  lessons: Lesson[]
  author: Author
  favoriteTags: Tag[]
}

const UserView = ({ lessons, author, favoriteTags }: Props) => {
  return (
    <Layout
      title={author.displayName || 'Author page'}
      breadcrumbs={[
        {
          label: author.displayName + "'s page",
          href: accountRouteHrefPath,
          as: accountRoute(author.uid),
        },
      ]}
    >
      <section className="flex mb-8">
        <div className="flex-grow">
          <div className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
            {author.displayName}
          </div>
          <div className="my-4">{author.bio}</div>
          <SocialLinks author={author} />
        </div>
        <div className="flex-none ml-12">
          <Avatar author={author} size="2xl" />
        </div>
      </section>
      <div className="flex flex-col flex-wrap md:flex-row">
        <div className="w-full md:w-2/3 md:pr-8">
          <h2 className="mb-2 text-xl font-bold leading-tight tracking-tighter md:text-2xl">
            Lessons
          </h2>
          {lessons && <LessonList lessons={lessons} authors={[author]} />}
          {!lessons?.length && 'Nothing here yet!'}
        </div>
        <div className="w-full md:w-1/3 md:pl-8">
          <Heading
            className="mb-4 font-bold leading-tight tracking-tighter"
            size="md"
          >
            Favorite topics
          </Heading>
          {!!favoriteTags?.length && <TagList tags={favoriteTags} />}
          {!favoriteTags?.length && 'Nothing here yet!'}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const author = await getAuthor(query.id as string)

  const lessons = await getLessons([
    where('authorId', '==', author.uid),
    where('private', '==', false),
  ])

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
      author,
      favoriteTags,
    },
  }
}

export default UserView
