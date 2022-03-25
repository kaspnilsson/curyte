import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import LessonList from '../components/LessonList'
import AuthorLink from '../components/AuthorLink'
import TagList from '../components/TagList'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { searchRouteHrefPath } from '../utils/routes'
import { Tag, Profile } from '@prisma/client'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import { PathWithProfile } from '../interfaces/path_with_profile'
import PathPreview from '../components/PathPreview'
import {
  queryLessons,
  queryPaths,
  queryProfiles,
  queryTags,
} from '../lib/apiHelpers'
import LoadingSpinner from '../components/LoadingSpinner'

type Props = {
  q: string
  lessons: LessonWithProfile[]
  tags: Tag[]
  paths: PathWithProfile[]
  profiles: Profile[]
}

const SearchView = ({ q }: Props) => {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lessons, setLessons] = useState<LessonWithProfile[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [paths, setPaths] = useState<PathWithProfile[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    const fetch = async () => {
      if (!q) return
      setLoading(true)
      await Promise.all([
        queryLessons(q).then(setLessons),
        queryPaths(q).then(setPaths),
        queryTags(q).then(setTags),
        queryProfiles(q).then(setProfiles),
      ])
      setLoading(false)
    }
    fetch()
  }, [q])

  useEffect(() => {
    // select the first tab w results
    if (loading) return
    if (lessons.length) {
      setActiveTab(0)
      return
    }
    if (profiles.length) {
      setActiveTab(1)
      return
    }
    if (paths.length) {
      setActiveTab(2)
      return
    }
    if (tags.length) {
      setActiveTab(3)
      return
    }
  }, [lessons.length, loading, paths.length, profiles.length, tags.length])

  if (loading) return <LoadingSpinner />
  return (
    <>
      <Layout
        title={'Curyte'}
        breadcrumbs={[
          {
            label: `Search results for '${q}'`,
            href: {
              pathname: searchRouteHrefPath,
              query: { q },
            },
          },
        ]}
        rightContent={
          <div className="flex flex-col w-full gap-8 divide-y">
            {activeTab !== 0 && (
              <div className="pt-8">
                <span className="mb-2 text-lg font-bold leading-tight tracking-tighter break-all line-clamp-1">
                  Lessons matching {q}
                </span>
                {!lessons.length && (
                  <div className="flex flex-col items-start gap-2 text-sm text-zinc-500">
                    Nothing here yet!
                  </div>
                )}
                {!!lessons.length && <LessonList small lessons={lessons} />}
              </div>
            )}
            {activeTab !== 1 && (
              <div className="pt-8">
                <span className="mb-2 text-lg font-bold leading-tight tracking-tighter break-all line-clamp-1">
                  People matching {q}
                </span>
                {!profiles.length && (
                  <div className="text-sm text-zinc-500">Nothing here yet!</div>
                )}
                {!!profiles.length && (
                  <div className="flex flex-col gap-4 mt-4">
                    {profiles.map((p) => (
                      <AuthorLink author={p} key={p.uid} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab !== 2 && (
              <div className="pt-8">
                <span className="mb-2 text-lg font-bold leading-tight tracking-tighter break-all line-clamp-1">
                  Paths matching {q}
                </span>
                {!paths.length && (
                  <div className="text-sm text-zinc-500">Nothing here yet!</div>
                )}
                {!!paths.length && (
                  <div className="flex flex-wrap w-full divide-y">
                    {paths.map((p) => (
                      <PathPreview
                        path={p}
                        key={p.uid}
                        author={p.profiles}
                        small
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab !== 3 && (
              <div className="pt-8">
                <span className="mb-2 text-lg font-bold leading-tight tracking-tighter break-all line-clamp-1">
                  Topics matching {q}
                </span>
                {!!tags?.length && <TagList tags={tags} />}
                {!tags?.length && (
                  <div className="text-sm text-zinc-500">Nothing here yet!</div>
                )}
              </div>
            )}
          </div>
        }
      >
        <section className="flex flex-col">
          <h1 className="pb-2 text-4xl font-bold leading-tight tracking-tighter break-all md:text-6xl text-zinc-500 line-clamp-1">
            Results for <span className="text-zinc-900">{q}</span>
          </h1>
        </section>
        <div className="w-full pt-2 mt-2">
          <Tabs
            colorScheme="black"
            isLazy
            onChange={(index) => setActiveTab(index)}
            index={activeTab}
          >
            <TabList>
              <Tab>Lessons</Tab>
              <Tab>People</Tab>
              <Tab>Paths</Tab>
              <Tab>Topics</Tab>
            </TabList>
            <TabPanels>
              <TabPanel className="!px-0">
                {!lessons.length && (
                  <div className="text-sm text-zinc-500">Nothing here yet!</div>
                )}
                {!!lessons.length && <LessonList lessons={lessons} />}
              </TabPanel>
              <TabPanel className="!px-0">
                {!profiles.length && (
                  <div className="text-sm text-zinc-500">Nothing here yet!</div>
                )}
                {!!profiles.length && (
                  <div className="flex flex-col gap-8 mt-4">
                    {profiles.map((p) => (
                      <AuthorLink author={p} key={p.uid} />
                    ))}
                  </div>
                )}
              </TabPanel>
              <TabPanel className="!px-0">
                {!paths.length && (
                  <div className="text-sm text-zinc-500">Nothing here yet!</div>
                )}
                {!!paths.length && (
                  <div className="flex flex-wrap w-full divide-y">
                    {paths.map((p) => (
                      <PathPreview path={p} key={p.uid} author={p.profiles} />
                    ))}
                  </div>
                )}
              </TabPanel>
              <TabPanel className="!px-0">
                {!tags.length && (
                  <div className="text-sm text-zinc-500">Nothing here yet!</div>
                )}
                {!!tags.length && <TagList tags={tags} />}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = query.q as string

  return {
    props: {
      q,
    },
  }
}

export default SearchView
