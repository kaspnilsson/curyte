/* eslint-disable @next/next/no-title-in-document-head */
import { Portal, Text } from '@chakra-ui/react'
import Link from 'next/link'
import CuryteLogo from '../components/CuryteLogo'
import Footer from '../components/Footer'
import { exploreRoute, searchRouteHrefPath } from '../utils/routes'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Confetti } from '../components/Confetti'
import guideMeSvg from '../public/guide_me.svg'
import selfGuidedSvg from '../public/self_guided.svg'
import Image from 'next/image'
import Container from '../components/Container'
import AuthorLink from '../components/AuthorLink'
import { useUserAndProfile } from '../contexts/user'

const NextStepsView = () => {
  const [isFiringConfetti, setIsFiringConfetti] = useState(false)

  const { userAndProfile } = useUserAndProfile()

  useEffect(() => {
    setTimeout(() => {
      setIsFiringConfetti(true)
      setTimeout(() => setIsFiringConfetti(false), 300)
    })
  }, [])

  return (
    <>
      <Head>
        <title>Curyte</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <Container className="flex items-center w-full gap-2 my-4">
          <Link href={exploreRoute} passHref>
            <h2 className="flex items-center gap-2 text-2xl font-bold leading-tight tracking-tighter">
              <CuryteLogo />
              Curyte
            </h2>
          </Link>
        </Container>
        <Container className="flex flex-col items-center justify-center flex-1 w-full my-16">
          <section className="flex flex-col items-center justify-center gap-8 py-4 w-96 h-fit">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter text-center md:text-6xl">
              Success! 👏
            </h1>
            {userAndProfile?.profile && (
              <AuthorLink author={userAndProfile.profile} />
            )}
          </section>
          <section className="flex flex-wrap items-center justify-center w-screen gap-4 mt-8">
            {/* <div>Welcome to Curyte!</div> */}
            <Link
              href={{
                pathname: searchRouteHrefPath,
                query: { q: 'curyte' },
              }}
              passHref
            >
              <div className="flex flex-col justify-between gap-4 p-8 border shadow-xl cursor-pointer rounded-xl hover:animate-wiggle w-72">
                <Image
                  height="256px"
                  width="256px"
                  src={guideMeSvg}
                  alt="Show me how to use Curyte"
                />
                <h3 className="flex items-center gap-2 text-xl font-bold leading-tight tracking-tighter">
                  Teach me how to Curyte
                </h3>
                <Text className="text-sm text-zinc-500">
                  Take a few short lessons (on Curyte!) to learn how to use the
                  editor and platform
                </Text>
              </div>
            </Link>
            <Link href={exploreRoute} passHref>
              <div className="flex flex-col justify-between gap-4 p-8 border shadow-xl cursor-pointer rounded-xl hover:animate-wiggle w-72">
                <Image
                  height="256px"
                  width="256px"
                  src={selfGuidedSvg}
                  alt="Go straight to the app"
                />
                {/* <Button size="lg" className="justify-center w-full">
                  Explore lessons from others
                </Button> */}
                <h3 className="flex items-center gap-2 text-xl font-bold leading-tight tracking-tighter">
                  Take me to the homepage
                </h3>
                <Text className="text-sm text-zinc-500">
                  Browse and copy hundreds of high quality lessons from teachers
                  around the world
                </Text>
              </div>
            </Link>
          </section>
        </Container>
        <Footer />
        <Portal>
          <Confetti isFiring={isFiringConfetti} />
        </Portal>
      </div>
    </>
  )
}

export default NextStepsView
