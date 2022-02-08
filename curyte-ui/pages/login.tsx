import Layout from '../components/Layout'
import React, { useState } from 'react'
import { Box, Button, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { exploreRoute } from '../utils/routes'
import supabase from '../supabase/client'
import InputDialog, { InputDialogProps } from '../components/InputDialog'

const Login = () => {
  const router = useRouter()
  const toast = useToast()

  // const redirectTo = `${
  //   process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL || 'curyte.com'
  // }${router.query.referrer ? (router.query.referrer as string) : exploreRoute}`
  const redirectTo = 'http://localhost:3000/explore'
  const [loading, setLoading] = useState(false)
  const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  const handleEmailConfirm = async (email: string) => {
    toast({
      title: 'Check your email for a magic link!',
    })
    setLoading(true)
    const { error } = await supabase.auth.signIn({ email }, { redirectTo })
    setLoading(false)
    if (error) {
      toast({
        status: 'error',
        title: error.message,
      })
    }
  }

  const logInWithGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signIn(
      {
        provider: 'google',
      },
      { redirectTo }
    )
    setLoading(false)
    if (error) {
      toast({
        status: 'error',
        title: error.message,
      })
    }
  }

  const logInWithFacebook = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signIn(
      {
        provider: 'facebook',
      },
      { redirectTo }
    )
    setLoading(false)
    if (error) {
      toast({
        status: 'error',
        title: error.message,
      })
    }
  }

  const openDialog = () => {
    setDialogProps({
      ...dialogProps,
      isOpen: true,
      title: 'Enter yout email',
      description: 'Enter an email to receive a magic link!',
      onClose: () => setDialogProps({ ...dialogProps, isOpen: false }),
      onConfirm: handleEmailConfirm,
    })
  }

  return (
    <Layout>
      <InputDialog {...dialogProps} />
      <Box
        rounded={'lg'}
        className="flex flex-col items-center justify-center gap-2 p-8 m-auto w-96"
        boxShadow={'lg'}
      >
        <h2 className="mb-4 text-xl font-bold leading-tight tracking-tighter md:text-2xl">
          Login
        </h2>
        {/* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} /> */}
        <Button disabled={loading} onClick={openDialog}>
          Email
        </Button>
        <Button
          disabled={loading}
          onClick={logInWithFacebook}
          colorScheme="facebook"
        >
          Facebook
        </Button>
        <Button disabled={loading} onClick={logInWithGoogle} colorScheme="red">
          Google
        </Button>
      </Box>
    </Layout>
  )
}

export default Login
