import React from 'react'
import CuryteLogo from '../components/CuryteLogo'
import { exploreRoute, newLessonRoute } from '../utils/routes'
import Link from 'next/link'
import { Button, Text } from '@chakra-ui/react'
import AutoPlaySilentVideo from '../components/AutoPlaySilentVideo'
import Footer from '../components/Footer'
import Container from '../components/Container'

const WhatIsCuryteView = () => {
  return (
    <>
      <Container className="mt-24">
        <section className="flex flex-col items-center justify-center gap-8 mb-12">
          <h1 className="text-6xl md:text-8xl text-center font-bold tracking-tighter leading-tight flex items-center gap-2 md:gap-4 aspect-[3/1]">
            <div className="hidden md:flex h-min-content">
              <CuryteLogo height={'80px'} width={'80px'} />
            </div>
            <div className="flex md:hidden h-min-content">
              <CuryteLogo height={'54px'} width={'54px'} />
            </div>
            Curyte
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-1 mb-8 text-4xl font-bold leading-tight tracking-tighter text-center">
            Engaging lessons,
            <div className="text-violet-500">digitally native.</div>
          </div>
          <div className="relative flex flex-col items-center gap-4 mb-16 md:flex-row align-center">
            <Link passHref href={exploreRoute}>
              <Button
                className="flex-1 shadow-xl shadow-violet-500/20"
                size="lg"
              >
                <div className="p-4">Explore</div>
              </Button>
            </Link>
            <Link passHref href={newLessonRoute()}>
              <Button
                size="lg"
                className="flex-1 shadow-xl shadow-violet-500/20"
                colorScheme="black"
              >
                <div className="p-4">Start writing</div>
              </Button>
            </Link>
          </div>
        </section>
        <section className="relative flex flex-col items-center justify-around mb-16">
          <div className="shadow-xl shadow-violet-500/20 rounded-xl overflow-hidden mb-40 border border-violet-200 lg:max-w-[60vw] hidden md:inline relative">
            <AutoPlaySilentVideo
              src="/static/promo.mp4"
              type="video/mp4"
              className="w-full"
            />
          </div>
          <div className="relative grid grid-cols-1 gap-12 md:mx-16 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4 p-4 text-center">
              <div className="w-20 h-20 text-6xl">🕓</div>
              <span className="text-4xl font-bold leading-tight tracking-tighter">
                Stop reinventing the wheel every week
              </span>
              <Text className="text-zinc-700">
                Explore an open-source curriculum with hundreds of lessons about
                anything from atoms to zygotes.
              </Text>
            </div>
            <div className="flex flex-col items-center gap-4 p-4 text-center">
              <div className="w-20 h-20 text-6xl">🔨</div>
              <span className="text-4xl font-bold leading-tight tracking-tighter">
                Create and curate in an editor built for teachers
              </span>
              <Text className="text-zinc-700">
                Keep your students focused with embedded videos, interactive
                questions, simulations, and entire websites.
              </Text>
            </div>
            <div className="flex flex-col items-center gap-4 p-4 text-center">
              <div className="w-20 h-20 text-6xl">🔗</div>
              <span className="text-4xl font-bold leading-tight tracking-tighter">
                Share everything learners need with one link
              </span>
              <Text className="text-zinc-700">
                Student-facing lessons with transparent objectives. No login, no
                class codes, no data collection.
              </Text>
            </div>
          </div>
        </section>
        {/* <section className="flex flex-col items-center justify-around mb-16">
        <p className="text-2xl font-semibold leading-tight tracking-tighter md:text-3xl">
          Curyte is a new lesson builder & library for the digital classroom.
        </p>
        <p className="text-2xl font-semibold leading-tight tracking-tighter md:text-3xl">
          Collect and organize docs, share them with students and colleagues,
          and explore what everyone else is teaching.
        </p>
      </section>
      <section className="flex flex-col flex-wrap items-center justify-around w-full gap-8 mb-16 md:items-start md:mb-32 lg:flex-row colums-lg">
        <div className="flex flex-col items-center flex-1 text-base w-72 md:w-96 md:text-xl">
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
        <div className="flex flex-col items-center flex-1 text-base w-72 md:w-96 md:text-xl">
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
      </section> */}
        <section className="flex flex-col items-center justify-around mb-24">
          <div className="mb-16 text-4xl font-bold leading-tight tracking-tighter text-center">
            Get started today!
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row align-center">
            <Link passHref href={newLessonRoute()}>
              <Button
                size="lg"
                className="flex-1 shadow-xl shadow-violet-500/20"
                colorScheme="black"
              >
                <div className="p-4">Start writing</div>
              </Button>
            </Link>
          </div>
        </section>
      </Container>
      <Footer />
    </>
  )
}

export default WhatIsCuryteView
