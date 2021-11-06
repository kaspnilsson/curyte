import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Layout from '../components/Layout';
import React from 'react';
import Container from '../components/Container';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../firebase/clientApp';

// Configure FirebaseUI.
const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

const Login = () => {
  return (
    <Layout>
      <Container>
        <Card className="max-w-sm w-96 m-auto">
          <CardHeader color="lightBlue">
            <h2
              color="white"
              className="text-xl md:text-2xl font-bold tracking-tight md:tracking-tighter leading-tight"
            >
              Login
            </h2>
          </CardHeader>
          <CardBody>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </CardBody>
        </Card>
      </Container>
    </Layout>
  );
};

export default Login;
