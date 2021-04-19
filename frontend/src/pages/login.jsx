import { useEffect } from 'react';
import { Box, Center, VStack } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import { useNavigate } from '@reach/router';

import { useAuth } from '../hooks/auth';
import LogoStackedWhite from '../components/logo-stacked-white';
import LineLoginButton from '../components/line-login-button';

const globalStyles = css`
  body {
    background-color: #000;
  }
`;

function Login() {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate('/');
    }
  }, [loading, isLoggedIn, navigate]);

  const handleClick = () => {
    window.location.href = process.env.REACT_APP_LOGIN_URL || '/auth/login';
  };

  return (
    <Box>
      <Global styles={globalStyles} />

      <Center h="md">
        <VStack spacing="6">
          <LogoStackedWhite />
          <LineLoginButton onClick={handleClick} isLoading={loading} />
        </VStack>
      </Center>
    </Box>
  );
}

export default Login;
