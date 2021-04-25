import { useState } from 'react';
import { Container, VStack, Box, HStack, Spacer, Avatar, Heading, Stat, StatLabel, StatNumber, Button, Text, Checkbox, useToast } from '@chakra-ui/react';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from '@reach/router';
import useSWR from 'swr';
import { Helmet } from 'react-helmet';

import { useAuth } from '../hooks/auth';
import LogoHorizontal from '../components/logo-horizontal';

function Pay({ machineId }) {
  const [inProgress, setInProgress] = useState(false);
  const [stayAfterPay, setStayAfterPay] = useState(false);

  const { user, client, refresh } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const { data: machineData } = useSWR(
    () => user ? `/api/machine/${machineId}` : null,
    (url) => client.get(url).then(({ data }) => data),
    { refreshInterval: 1000 },
  );

  const canAfford = machineData?.defaultAmount && user.points >= machineData.defaultAmount;

  const handlePay = async () => {
    setInProgress(true);

    try {
      const { data } = await client.post('/api/pay', { machineId });

      if (!data.success) {
        toast({
          title: '付款發生錯誤，請再試一次',
          status: 'error',
        });
        return;
      }

      toast({
        title: '付款成功，讚啦 👍',
        status: 'success',
      });

      refresh();

      if (stayAfterPay) {
        return;
      }
      navigate('/');
    } catch (err) {
      toast({
        title: '付款發生錯誤，請再試一次',
        status: 'error',
      });
    } finally {
      setInProgress(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleStayCheck = (e) => {
    setStayAfterPay(e.target.checked);
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Helmet>
        <title>結帳{machineData ? `：${machineData.machineName}` : ''} - LINER Eats</title>
      </Helmet>

      <VStack>
        <Box width="100%" py={5}>
          <HStack>
            <LogoHorizontal />
            <Spacer />
            <Avatar size="md" name={user.displayName} src={user.photoUrl} />
          </HStack>
        </Box>

        <Box width="100%" paddingTop="5">
          <VStack mb="7" alignItems="stretch">
            <Heading>付款</Heading>
            <Text fontSize="xl">{machineData ? machineData.machineName : <BeatLoader size={7} color="gray" />}</Text>
          </VStack>

          <Stat>
            <StatLabel>點數</StatLabel>

            <StatNumber fontSize="4xl">
              {machineData ? machineData.defaultAmount : <BeatLoader size={7} color="gray" />}
            </StatNumber>
          </Stat>

          {machineData?.defaultAmount ? (
            <>
              {canAfford ? (
                <Text>確認品項後按鈕付款。</Text>
              ) : (
                <Text textColor="red">抱歉，剩餘點數不足</Text>
              )}
            </>
          ) : (
            <Text>你還沒選擇品項喔！選完點數會自動更新。</Text>
          )}

          <VStack alignItems="stretch" mt="6">
            <Checkbox isChecked={stayAfterPay} onChange={handleStayCheck}>連續購買模式</Checkbox>

            <Button
              size="lg"
              colorScheme="green"
              onClick={handlePay}
              disabled={!machineData?.defaultAmount || !canAfford}
              isLoading={inProgress}
            >
              確認付款
            </Button>

            <Button size="lg" colorScheme="red" onClick={handleCancel} isLoading={inProgress}>取消</Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default Pay;
