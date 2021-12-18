import Layout from '../components/Layout'
import React from 'react'
import Container from '../components/Container'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from '../firebase/clientApp'
import { Box } from '@chakra-ui/react'

// Configure FirebaseUI.
const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
}

const Login = () => {
  return (
    <Layout>
      <Container>
        <Box
          rounded={'lg'}
          className="w-96 m-auto p-8 flex flex-col items-center"
          boxShadow={'lg'}
        >
          <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight mb-4">
            Login
          </h2>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </Box>
      </Container>
    </Layout>
  )
}

export default Login
