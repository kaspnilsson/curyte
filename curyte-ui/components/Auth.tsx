// components/Auth.tsx
import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from '../firebase/clientApp'

// Configure FirebaseUI.
const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display GitHub as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
}

const SignInScreen = () => {
  return (
    <div>
      <h1>Curyte Login</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  )
}

export default SignInScreen
