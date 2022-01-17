import React from 'react'
import Layout from '../components/Layout'
import CuryteLogo from '../components/CuryteLogo'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { auth } from '../firebase/clientApp'
import { lessonSearchRoute, newLessonRoute, myAccountRoute } from '../utils/routes'
import Link from 'next/link'
import { Button } from '@chakra-ui/react'
import AutoPlaySilentVideo from '../components/AutoPlaySilentVideo'

const Home = () => {
  const router = useRouter()
  const [user] = useAuthState(auth)

  // const { data, loading } = useAsync(
  //   () => getLessons([]).then((lessons) => lessons.length),
  //   []
  // )
  if (user && process.env.NODE_ENV === 'production') {
    router.replace(lessonSearchRoute())
  }

  return (
    <Layout>
      <section className="flex flex-row items-center justify-center mb-8">
        <h1 className="text-6xl md:text-6xl text-center font-bold tracking-tighter leading-tight flex items-center gap-2 md:gap-4 aspect-[3/1]">
          <div className="hidden md:flex h-min-content">
            <CuryteLogo height={'50px'} width={'50px'} />
          </div>
          <div className="flex md:hidden h-min-content">
            <CuryteLogo height={'50px'} width={'50px'} />
          </div>
          Curyte
        </h1>
      </section>
            <section className="flex flex-col items-center justify-around mb-8">
         <div className="flex flex-col items-center gap-4 md:flex-row align-center">
       <Link passHref href={newLessonRoute()}>
            <Button
              size="lg"
              className="flex-1 shadow-xl shadow-sky-500/20"
              colorScheme="black"
            >
              <div className="p-4">Create a lesson</div>
            </Button>
          </Link>
            <Link passHref href={lessonSearchRoute()}>
            <Button
              size="lg"
              className="flex-1"
              colorScheme="gray"
            >
              <div className="p-4">Explore</div>
            </Button>
          </Link>
          </div>
          </section>
         <section className="flex flex-col items-center justify-around mb-8">
        <ul>
        <div className="mx-20 my-10 p-5 border-2 hover:border-yellow-300 leading-tight tracking-tighter bg-zinc-200 rounded-2xl">
          <p className="text-xl font-semibold">🧭 &nbsp;&nbsp; Stop reinventing the wheel every week to plan engaging lessons for learners.</p>
          <p> Explore an open-source curriculum that is always up to date because it’s being added to by a community of teachers like you.</p>
        </div>
        <div className="mx-20 my-10 p-5 border-2 hover:border-blue-400 leading-tight tracking-tighter bg-zinc-200 rounded-2xl">
          <p className="text-xl font-semibold">🔨 &nbsp;&nbsp;Create and curate in an editor made for organizing education content.</p>
          <p> Instead of using a document editor, use a lesson editor that's built to embed everything from videos to interactive questions and entire websites.</p>
        </div>
        <div className="mx-20 my-10 p-5 border-2 hover:border-purple-600 leading-tight tracking-tighter bg-zinc-200 rounded-2xl">
          <p className="text-xl font-semibold">🔗 &nbsp;&nbsp;Share everything learners need in one place with just a link.</p>
          <p> Student-facing lessons with transparent objectives. No login, no class code, no collected data.</p>
        </div>
        </ul>
      </section>
      <section className="flex flex-col items-center justify-around mb-8">
          {/* <Link passHref href={lessonSearchRoute()}>
              <Button
                className="flex flex-1"
                colorScheme="black"
                variant="outline"
              >
                <div className="p-4">
                  Search all {loading ? <Spinner size="xs" /> : data || ''}{' '}
                  lessons
                </div>
              </Button>
            </Link> */}
        <div className="shadow-xl shadow-sky-500/20 rounded-xl overflow-hidden mb-16 border-2 border-zinc-200 lg:max-w-[60vw] hidden md:inline">
          <AutoPlaySilentVideo
            src="/static/promo.mp4"
            type="video/mp4"
            className="w-full"
          />
        </div>
      </section>
    </Layout>
  )
}

export default Home
