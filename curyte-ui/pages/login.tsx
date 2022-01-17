import Layout from '../components/Layout'
import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth } from '../firebase/clientApp'
import { Box } from '@chakra-ui/react'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/router'

const Login = () => {
  const router = useRouter()
  const signInSuccessWithAuthResult = () => {
    router.push(router.query.referrer ? (router.query.referrer as string) : '/')
    return false
  }
  const uiConfig = {
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],
    signInFlow: 'popup',
    callbacks: { signInSuccessWithAuthResult },
  }

  return (
    <Layout>
      <Box
        rounded={'lg'}
        className="flex flex-col items-center p-8 m-auto w-96"
        boxShadow={'lg'}
      >
        <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight md:text-2xl">
          Login
        </h2>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </Box>
    </Layout>
  )
}

export default Login
