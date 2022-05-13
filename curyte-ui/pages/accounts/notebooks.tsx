/* eslint-disable react/jsx-filename-extension */
import { withPageAuth, getUser } from '@supabase/supabase-auth-helpers/nextjs'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import React, { useEffect } from 'react'
import Layout from '../../components/Layout'
import { loginRoute, workspaceRoute } from '../../utils/routes'
import prismaClient from '../../lib/prisma'
import { useUserAndProfile } from '../../contexts/user'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Notes } from '../../interfaces/notes_with_profile'
import NotesRenderer from '../../components/NotesRenderer'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

interface Props {
  notes: Notes[]
}

const NotebooksView = ({ notes }: Props) => {
  const router = useRouter()
  const { userAndProfile, loading } = useUserAndProfile()

  useEffect(() => {
    if (loading) return
    if (!userAndProfile) router.push(loginRoute())
  }, [userAndProfile, router, loading])

  if (loading) return <LoadingSpinner />
  return (
    <>
      {!userAndProfile && <ErrorPage statusCode={403} />}
      {userAndProfile && (
        <Layout
          breadcrumbs={[
            {
              label: 'Notebooks',
              href: workspaceRoute,
              as: workspaceRoute,
            },
          ]}
          title="Notebooks"
        >
          <section className="flex flex-row">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
              Notebooks
            </h1>
          </section>
          <div className="w-full pt-2 mt-4">
            {!notes.length && (
              <div className="text-sm text-zinc-500">Nothing here yet!</div>
            )}
            {!!notes.length && (
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 700: 2, 1000: 3, 1300: 4 }}
              >
                <Masonry gutter="1rem">
                  {notes
                    .filter((n) => !!n.lessons && !!n.content)
                    .map((n, index) => (
                      <NotesRenderer key={index} notes={n} titleMode="lesson" />
                    ))}
                </Masonry>
              </ResponsiveMasonry>
            )}
          </div>
        </Layout>
      )}
    </>
  )
}

export const getServerSideProps = withPageAuth({
  redirectTo: loginRoute(),
  getServerSideProps: async (ctx) => {
    const { user } = await getUser(ctx)

    const notes = await prismaClient.notes.findMany({
      where: { userId: user?.id || 'no_user' },
      include: {
        profiles: true,
        lessons: { include: { profiles: true } },
        feedback: { include: { profiles: true } },
      },
      orderBy: { updated: 'desc' },
    })

    return { props: { notes } }
  },
})

export default NotebooksView
