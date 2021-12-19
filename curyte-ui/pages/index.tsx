import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Container from '../components/Container'
import CuryteLogo from '../components/CuryteLogo'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import firebase from '../firebase/clientApp'
import { lessonSearchRoute, newLessonRoute } from '../utils/routes'
import Link from 'next/link'
import { Button, Spinner } from '@chakra-ui/react'
import * as api from '../firebase/api'
import useAsync from '../hooks/useAsync'

const Home = () => {
  const router = useRouter()
  const [user] = useAuthState(firebase.auth())

  const { data, loading } = useAsync(
    () => api.getLessons([]).then((lessons) => lessons.length),
    []
  )
  useEffect(() => {
    if (user && process.env.NODE_ENV === 'production') {
      router.replace(lessonSearchRoute())
    }
  })

  return (
    <Layout>
      <Container className="flex flex-col items-center">
        <section className="flex-row flex items-center justify-center mt-16 mb-8">
          <h1 className="text-8xl text-center font-bold tracking-tighter leading-tight flex items-center gap-4 aspect-[3/1]">
            <CuryteLogo height={'97.5px'} width={'97.5px'} />
            Curyte
          </h1>
        </section>
        <section className="flex-col flex items-center justify-around mb-8">
          <div className="aspect-video shadow-xl shadow-purple-500/20 rounded-xl overflow-hidden mb-16 border-2 border-slate-200 lg:max-w-[60vw]">
            <video autoPlay loop muted>
              <source src="/static/promo.webm" />
            </video>
          </div>
          <div className="text-center mb-8 text-4xl font-bold tracking-tighter leading-tight">
            Engaging lessons,
            <div className="text-purple-500">digitally native.</div>
          </div>
          <div className="mb-8 flex items-center align-center gap-4">
            <Link passHref href={lessonSearchRoute()}>
              <Button
                className="flex-1 flex"
                colorScheme="purple"
                variant="outline"
              >
                <div className="p-4">
                  Search all {loading ? <Spinner size="xs" /> : data || ''}{' '}
                  lessons
                </div>
              </Button>
            </Link>
            <Link passHref href={newLessonRoute()}>
              <Button className="flex-1" colorScheme="purple">
                <div className="p-4">Start writing</div>
              </Button>
            </Link>
          </div>
        </section>
        <section className="flex-col flex items-center justify-around mb-8">
          <p className="text-3xl tracking-tighter leading-tight font-semibold">
            Curyte is a new lesson builder & library for the remote age. Collect
            and organize docs, share them with students and colleagues, and
            explore what everyone else is teaching.
          </p>
        </section>
        <section className="columns-sm text-xl w-full mb-32">
          <ul>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Search through free lessons
            </li>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Save a library of lessons
            </li>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Copy and modify lessons
            </li>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Collect donations
            </li>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Google Docs integration
            </li>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Youtube integration
            </li>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Rich text formatting
            </li>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Embed any web page
            </li>
            <li className="py-2 flex gap-3 items-center">
              <div className="text-base">✅</div>
              Interactive quizzes
            </li>
          </ul>
        </section>
        <section className="flex-col flex items-center justify-around mb-8">
          <div className="text-center mb-8 text-4xl font-bold tracking-tighter leading-tight">
            Get started today!
          </div>
          {/* <div className="mb-8 flex items-center align-center gap-4">
            <Link passHref href={newLessonRoute()}>
              <Button className="flex-1" colorScheme="purple">
                <div className="p-4">Start writing</div>
              </Button>
            </Link>
          </div> */}
        </section>
      </Container>
    </Layout>
  )
}

export default Home
