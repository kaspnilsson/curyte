import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Container from '../components/Container'
import CuryteLogo from '../components/CuryteLogo'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { auth } from '../firebase/clientApp'
import { lessonSearchRoute, newLessonRoute } from '../utils/routes'
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
  useEffect(() => {
    if (user && process.env.NODE_ENV === 'production') {
      router.replace(lessonSearchRoute())
    }
  })

  return (
    <Layout>
      <section className="flex flex-row items-center justify-center mb-8">
        <h1 className="text-6xl md:text-8xl text-center font-bold tracking-tighter leading-tight flex items-center gap-2 md:gap-4 aspect-[3/1]">
          <div className="hidden md:flex h-min-content">
            <CuryteLogo height={'80px'} width={'80px'} />
          </div>
          <div className="flex md:hidden h-min-content">
            <CuryteLogo height={'54px'} width={'54px'} />
          </div>
          Curyte
        </h1>
      </section>
      <section className="flex flex-col items-center justify-around mb-8">
        <div className="flex flex-col items-center gap-4 mb-8 md:flex-row align-center">
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
          <Link passHref href={newLessonRoute()}>
            <Button
              size="lg"
              className="flex-1 shadow-xl shadow-sky-500/20"
              colorScheme="black"
            >
              <div className="p-4">Start writing</div>
            </Button>
          </Link>
        </div>
        <div className="shadow-xl shadow-sky-500/20 rounded-xl overflow-hidden mb-16 border-2 border-zinc-200 lg:max-w-[60vw] hidden md:inline">
          <AutoPlaySilentVideo
            src="/static/promo.mp4"
            type="video/mp4"
            className="w-full"
          />
        </div>
        <div className="mb-8 text-4xl font-bold leading-tight tracking-tighter text-center">
          Engaging lessons,
          <div className="text-sky-500">digitally native.</div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-around mb-8">
        <p className="text-2xl font-semibold leading-tight tracking-tighter md:text-3xl">
          Curyte is a new lesson builder & library for the digital classroom.
        </p>
        <p className="text-2xl font-semibold leading-tight tracking-tighter md:text-3xl">
          Collect and organize docs, share them with students and colleagues,
          and explore what everyone else is teaching.
        </p>
      </section>
      <section className="flex flex-col flex-wrap items-center justify-around w-full gap-8 mb-16 md:items-start md:mb-32 lg:flex-row colums-lg">
        <div className="flex flex-col items-center flex-1 text-base w-80 md:w-96 md:text-xl">
          <ul className="flex-1">
            <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tighter text-center">
              Browse
            </h3>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Search through free lessons
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Explore what others are teaching
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Collect a library of lessons
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Build your personal profile
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Send lessons to learners with just a link
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Collect donations
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center flex-1 text-base w-80 md:w-96 md:text-xl">
          <ul className="flex-1">
            <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tighter text-center">
              Build
            </h3>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Create interactive lessons
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Add questions, videos, and entire websites
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Insert Google Docs, Slides, and more
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Insert Youtube videos
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Tag with topics, standards, and skill level
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Organize lessons into paths
            </li>
            <li className="flex items-center gap-3 py-2">
              <div className="text-base">✅</div>
              Share your lessons with the world
            </li>
          </ul>
        </div>
      </section>
      <section className="flex flex-col items-center justify-around mb-8">
        <div className="mb-8 text-4xl font-bold leading-tight tracking-tighter text-center">
          Get started today!
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row align-center">
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
          <Link passHref href={newLessonRoute()}>
            <Button
              size="lg"
              className="flex-1 shadow-xl shadow-sky-500/20"
              colorScheme="black"
            >
              <div className="p-4">Start writing</div>
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export default Home
