import Layout from '../components/Layout'
import React, { useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth } from '../firebase/clientApp'
import { Box, Button } from '@chakra-ui/react'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/router'
import { exploreRoute } from '../utils/routes'
import supabase from '../supabase/client'
import InputDialog, { InputDialogProps } from '../components/InputDialog'

const Login = () => {
  // const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  const handleEmailConfirm = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      // alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const logInWithGoogle = async () => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'google',
    })
  }
  const logInWithFacebook = async () => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'facebook',
    })
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
