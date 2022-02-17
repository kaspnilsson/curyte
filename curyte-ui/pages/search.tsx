import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import LessonList from '../components/LessonList'
import TagList from '../components/TagList'
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { searchRoute, searchRouteHrefPath } from '../utils/routes'
import { Tag, Profile } from '@prisma/client'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import { PathWithProfile } from '../interfaces/path_with_profile'
import { searchPaths } from './api/paths/search'
import { searchProfiles } from './api/profiles/search'
import { searchTags } from './api/tags/search'
import { searchLessons } from './api/lessons/search'
import supabase from '../supabase/client'
import PathPreview from '../components/PathPreview'

type Props = {
  q: string
  lessons: LessonWithProfile[]
  tags: Tag[]
  paths: PathWithProfile[]
  profiles: Profile[]
}

const SearchView = ({ q, lessons, tags, paths, profiles }: Props) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <Layout
        title={'Curyte'}
        breadcrumbs={[
          {
            label: `Search results for '${q}'`,
            href: searchRouteHrefPath,
            as: searchRoute(q),
          },
        ]}
        rightContent={
          <div className="flex flex-col w-full gap-8 divide-y">
            {activeTab !== 0 && (
              <div className="pt-8">
                <Heading
                  className="mb-2 font-bold leading-tight tracking-tighter line-clamp-1"
                  size="sm"
                >
                  Lessons matching {q}
                </Heading>
                {!lessons.length && (
                  <div className="flex flex-col items-start gap-2">
                    Nothing here yet!
                  </div>
                )}
                {!!lessons.length && <LessonList noCover lessons={lessons} />}
              </div>
            )}
            {activeTab !== 1 && (
              <div className="pt-8">
                <Heading
                  className="mb-2 font-bold leading-tight tracking-tighter line-clamp-1"
                  size="sm"
                >
                  People matching {q}
                </Heading>
                {!profiles.length && <div>Nothing here yet!</div>}
                {!!profiles.length &&
                  profiles.map((p) => (
                    <span key={p.uid}>{JSON.stringify(p)}</span>
                  ))}
              </div>
            )}
            {activeTab !== 2 && (
              <div className="pt-8">
                <Heading
                  className="mb-2 font-bold leading-tight tracking-tighter line-clamp-1"
                  size="sm"
                >
                  Paths matching {q}
                </Heading>
                {!paths.length && <div className="">Nothing here yet!</div>}
                {!!paths.length && (
                  <div className="flex flex-wrap w-full divide-y">
                    {paths.map((p) => (
                      <PathPreview
                        path={p}
                        key={p.uid}
                        author={p.profiles}
                        noCover
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab !== 3 && (
              <div className="pt-8">
                <Heading
                  className="mb-2 font-bold leading-tight tracking-tighter line-clamp-1"
                  size="sm"
                >
                  Topics matching {q}
                </Heading>
                {!!tags?.length && <TagList tags={tags} />}
                {!tags?.length && 'Nothing here yet!'}
              </div>
            )}
          </div>
        }
      >
        <section className="flex flex-col">
          <h1 className="pb-2 text-4xl font-bold leading-tight tracking-tighter md:text-6xl text-zinc-500 line-clamp-1">
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
                  <div className="flex flex-col items-start gap-2">
                    Nothing here yet!
                  </div>
                )}
                {!!lessons.length && <LessonList lessons={lessons} />}
              </TabPanel>
              <TabPanel className="!px-0">
                {!profiles.length && <div>Nothing here yet!</div>}
                {!!profiles.length &&
                  profiles.map((p) => (
                    <span key={p.uid}>{JSON.stringify(p)}</span>
                  ))}
              </TabPanel>
              <TabPanel className="!px-0">
                {!paths.length && <div className="">Nothing here yet!</div>}
                {!!paths.length && (
                  <div className="flex flex-wrap w-full divide-y">
                    {paths.map((p) => (
                      <PathPreview path={p} key={p.uid} author={p.profiles} />
                    ))}
                  </div>
                )}
              </TabPanel>
              <TabPanel className="!px-0">
                {!tags.length && <div>Nothing here yet!</div>}
                {!!tags.length && <TagList tags={tags} />}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const q = query.q as string
  const { user } = await supabase.auth.api.getUserByCookie(req)

  const [lessons, tags, profiles, paths] = await Promise.all([
    searchLessons(q, user),
    searchTags(q),
    searchProfiles(q),
    searchPaths(q, user),
  ])

  return {
    props: {
      q,
      lessons,
      tags,
      profiles,
      paths,
    },
  }
}

export default SearchView
