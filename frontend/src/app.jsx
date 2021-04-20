import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Router, Redirect } from '@reach/router';

import { useAuth } from './hooks/auth';
import Login from './pages/login';
import Main from './pages/main';
import Welcome from './pages/welcome';
import Scan from './pages/scan';
import Pay from './pages/pay';
import UserAgentDetector from './components/user-agent-detector';

const theme = extendTheme({
  colors: {
    lineGreen: '#07b53b',
  },
});

function App() {
  const { user, loading, isLoggedIn } = useAuth();
  console.log('user loding isloggedIn', user, loading, isLoggedIn);

  let redirectComponent = null;

  if (!loading && !isLoggedIn) {
    console.log('redirect to login');
    redirectComponent = <Redirect to="/login" noThrow />;
  } else if (user && !user.payCodeRegistered) {
    redirectComponent = <Redirect to="/welcome" noThrow />;
  }

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Login path="login" />
        <Main path="/" />
        <Welcome path="welcome" />
        <Scan path="scan" />
        <Pay path="pay/:machineId" />
      </Router>

      {redirectComponent}
      <UserAgentDetector />
    </ChakraProvider>
  );
}

export default App;
