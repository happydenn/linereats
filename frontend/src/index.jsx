import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ColorModeScript } from '@chakra-ui/react';

import firebase from 'firebase/app';
import 'firebase/auth';

import { AuthProvider } from './hooks/auth';
import App from './app';

firebase.initializeApp({
  apiKey: "AIzaSyBSN6AKk-W5eQfReq5KluE7iNxtZ8VvJQ0",
  authDomain: "linereats.firebaseapp.com",
  projectId: "linereats",
  storageBucket: "linereats.appspot.com",
  messagingSenderId: "624684848408",
  appId: "1:624684848408:web:49da7580b8119cf1f8fa6d",
  measurementId: "G-MREGJ9FDS8",
});

if (process.env.REACT_APP_ENVIRONMENT === 'local') {
  console.log('running in local environment');
  firebase.auth().useEmulator('http://localhost:9099');
}

(async () => {
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = hashParams.get('access_token');

  if (accessToken) {
    console.log(accessToken);
    const newUrl = window.location.href.replace(window.location.hash, '');
    window.history.replaceState(null, '', newUrl);

    try {
      await firebase.auth().signInWithCustomToken(accessToken);
      console.log('user logged in');
    } catch (error) {
      console.warn('error logging in');
    }
  }

  ReactDOM.render(
    <StrictMode>
      <ColorModeScript />

      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
    document.getElementById('root')
  );
})();
