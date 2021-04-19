import { Box, Text, Container, VStack, Heading, Button, HStack, Avatar, Spacer, Stat, StatLabel, StatNumber, Center } from '@chakra-ui/react';
import { Link } from '@reach/router';
import { BeatLoader } from 'react-spinners';

import LogoHorizontal from '../components/logo-horizontal';
import { useAuth } from '../hooks/auth';

function Main() {
  const { user, loading } = useAuth();

  console.log('Main:currentUser', user);

  if (loading || !user) {
    return (
      <Container>
        <Center h="md">
          <VStack spacing="8">
            <LogoHorizontal />
            <BeatLoader size={9} color="green" />
          </VStack>
        </Center>
      </Container>
    );
  }

  return (
    <Container>
      <VStack>
        <Box width="100%" py={5}>
          <HStack>
            <LogoHorizontal />
            <Spacer />
            <Avatar size="md" name={user.displayName} src={user.photoUrl} />
          </HStack>
        </Box>

        <Box width="100%" paddingTop="5">
          <Heading mb={10}>歡迎！</Heading>

          <Stat>
            <StatLabel>剩餘點數</StatLabel>
            <StatNumber fontSize="4xl">{user.points}</StatNumber>
          </Stat>

          <VStack alignItems="stretch" mt="8">
            <Button as={Link} size="lg" colorScheme="green" to="scan">掃描條碼</Button>
            <Text fontSize="sm" fontStyle="italic">請確認瀏覽器有相機開啟權限，iOS 使用者請使用 Safari</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default Main;
