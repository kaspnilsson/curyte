import React, { SyntheticEvent, useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  chakra,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import Link from 'next/link'
import { exploreRoute } from '../utils/routes'
import GoogleLogo from '../components/icons/GoogleLogo'
import FacebookLogo from '../components/icons/FacebookLogo'
import Footer from '../components/Footer'
import CuryteLogo from '../components/CuryteLogo'
import Head from 'next/head'
import Container from '../components/Container'
import { useRouter } from 'next/router'

const REDIRECT_URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL

const Login = () => {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { referrer } = router.query
  const redirectTo = referrer
    ? // ? `${REDIRECT_URL_BASE}${referrer}`
      `${REDIRECT_URL_BASE}${'referrer'}`
    : REDIRECT_URL_BASE

  useEffect(() => {
    if (!REDIRECT_URL_BASE) {
      toast({
        // infinite duration
        duration: null,
        id: 'wrong-host',
        isClosable: true,
        status: 'error',
        title: 'Invalid server configuration',
        description: 'Missing REDIRECT_URL_BASE',
      })
    } else if (window && window.location) {
      const redirectHost = new URL(REDIRECT_URL_BASE).host
      if (window.location.host !== redirectHost) {
        toast({
          // infinite duration
          duration: null,
          id: 'wrong-host',
          isClosable: true,
          status: 'error',
          title: 'Invalid server configuration',
          description: `Incorrect REDIRECT_URL_BASE: set to ${REDIRECT_URL_BASE}, which is a different host`,
        })
      }
    }
  }, [toast])

  const submitHandler = async (event: SyntheticEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const res = await supabaseClient.auth.signIn(
      {
        email,
      },
      {
        redirectTo,
      }
    )
    toast({ title: 'Check your email for a sign in link!' })
    if (res.error) {
      setError(res.error.message)
    }

    setIsLoading(false)
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    setError('')
    const { error } = await supabaseClient.auth.signIn(
      {
        provider: 'google',
      },
      {
        redirectTo,
      }
    )
    if (error) {
      setError(error.message)
    }

    setIsLoading(false)
  }

  const signInWithFacebook = async () => {
    setIsLoading(true)
    setError('')
    const { error } = await supabaseClient.auth.signIn(
      {
        provider: 'facebook',
      },
      {
        redirectTo,
      }
    )
    if (error) {
      setError(error.message)
    }

    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>Curyte: Log in</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <Container className="flex items-center w-full gap-2 my-4">
          <Link href={exploreRoute} passHref>
            <h2 className="flex items-center gap-2 text-2xl font-bold leading-tight tracking-tighter cursor-pointer hover:underline">
              <CuryteLogo />
              Curyte
              {isLoading && <Spinner />}
            </h2>
          </Link>
        </Container>
        <Container className="flex flex-col items-center justify-center flex-1 my-16">
          <section className="flex flex-row w-72 md:w-96">
            <div className="flex flex-col items-start justify-center gap-4">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
                Log in
              </h1>
              <h3 className="flex items-center gap-1 font-semibold leading-tight tracking-tighter text-zinc-500">
                Not a member? Just log in and Curyte will create an account for
                you!
              </h3>
            </div>
          </section>
          <section className="flex flex-col gap-2 mt-8 w-72 md:w-96">
            <Button
              className="relative"
              onClick={signInWithGoogle}
              disabled={isLoading}
            >
              <span className="absolute left-4">
                <GoogleLogo />
              </span>
              Log in with Google
            </Button>
            <Button
              className="relative"
              onClick={signInWithFacebook}
              disabled={isLoading}
            >
              <span className="absolute left-4">
                <FacebookLogo />
              </span>
              Log in with Facebook
            </Button>
            <chakra.form
              className="flex flex-col gap-2 mt-8"
              onSubmit={submitHandler}
              disabled={isLoading}
            >
              <FormControl id="email">
                <FormLabel className="font-semibold leading-tight tracking-tighter text-zinc-500">
                  Or, log in with email
                </FormLabel>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </FormControl>
              {error && <span className="text-red-500">{error}</span>}
              <Button
                colorScheme="black"
                className="justify-end mt-4 ml-auto"
                type="submit"
                disabled={isLoading}
              >
                Continue
              </Button>
            </chakra.form>
          </section>
        </Container>
        <Footer />
      </div>
    </>
  )
}

export default Login
