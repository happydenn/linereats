import { createContext, useState, useContext, useEffect } from 'react';
import firebase from 'firebase/app';
import axios from 'axios';
import useSWR, { mutate } from 'swr';

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [initialized, setInitialized] = useState(false);
  const [idToken, setIdToken] = useState(null);

  const client = axios.create({ headers: { authorization: `Bearer ${idToken}` } });
  const { data: user, error } = useSWR(
    () => initialized ? '/api/me' : null,
    async (url) => {
      const { data } = await client.get(url);
      return data;
    },
    { shouldRetryOnError: false },
  );
  const loading = (typeof user === 'undefined') && (typeof error === 'undefined');
  const isLoggedIn = !!user;
  const refresh = () => mutate('/api/me');

  useEffect(() => firebase.auth().onAuthStateChanged(async (fbUser) => {
    if (fbUser) {
      window.dataLayer.push({
        event: 'authenticate',
        userId: fbUser.uid,
      });

      const token = await fbUser.getIdToken();
      setIdToken(token);
    }

    setInitialized(true);
  }), []);

  useEffect(() => {
    if (initialized) {
      window.dataLayer.push({ event: 'initGA' });
    }
  }, [initialized]);

  return initialized ? (
    <AuthContext.Provider value={{user, error, loading, client, isLoggedIn, refresh}}>
      {children}
    </AuthContext.Provider>
  ) : null;
}

export { AuthProvider, useAuth };
