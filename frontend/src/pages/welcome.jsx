import { useState, useEffect } from 'react';
import { Box, Container, VStack, Heading, Text, Input, Button, FormControl, FormErrorMessage, useToast } from '@chakra-ui/react';
import { useNavigate } from '@reach/router';

import { useAuth } from '../hooks/auth';
import LogoHorizontal from '../components/logo-horizontal';

function Welcome() {
  const [payCode, setPayCode] = useState('');
  const [payCodeError, setPayCodeError] = useState();
  const [registerLoading, setRegisterLoading] = useState(false);

  const { client, refresh, user, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.payCodeRegistered) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleClick = async () => {
    setRegisterLoading(true);
    setPayCodeError('');

    try {
      const { data } = await client.post('/api/register-paycode', { payCode });

      if (!data.success) {
        setPayCodeError('註冊錯誤，請檢查零食碼是否正確，然後再試一遍。');
        return;
      }

      toast({ title: '零食碼註冊成功', status: 'success' });
      refresh();
      navigate('/');
    } catch (error) {
      setPayCodeError('註冊錯誤，請再試一遍。');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Container>
      <VStack>
        <Box width="100%" py={5}>
          <LogoHorizontal />
        </Box>

        <Box width="100%" paddingTop="5">
          <Heading mb={10}>準備開始！</Heading>

          <VStack alignItems="stretch" spacing="4">
            <Text>剩下最後一步了！請在下方輸入你的零食碼。</Text>

            <Box>
              <FormControl isInvalid={payCodeError}>
                <Input
                  type="password"
                  placeholder="零食碼"
                  value={payCode}
                  onChange={(e) => setPayCode(e.target.value)}
                />
                <FormErrorMessage>{payCodeError}</FormErrorMessage>
              </FormControl>
            </Box>

            <Button colorScheme="green" onClick={handleClick} isLoading={registerLoading || loading}>確認</Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default Welcome;
