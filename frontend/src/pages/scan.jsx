import { Global, css } from '@emotion/react';
import { Button, Text, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from '@reach/router';
import QrReader from 'modern-react-qr-reader';

const globalStyles = css`
  body {
    background-color: #000;
  }
`;

function Scan() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleScan = (result) => {
    if (result === null) {
      return;
    }

    console.log(result);

    const validUrlPrefix = `${process.env.REACT_APP_PAY_VALID_URL}/machineid/`;
    if (!result.startsWith(validUrlPrefix)) {
      return;
    }

    const machineId = result.slice(validUrlPrefix.length);
    navigate(`/pay/${machineId}`);
  };

  const handleError = () => {
    toast({
      title: '掃描時發生錯誤',
      status: 'error',
    });

    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Global styles={globalStyles} />

      <VStack mt="80px" spacing="10">
        <QrReader
          delay={250}
          facingMode="environment"
          showViewFinder={false}
          style={{width: '100%'}}
          onScan={handleScan}
          onError={handleError}
        />

        <Text textColor="white">請對準販賣機上的QR Code</Text>
        <Button colorScheme="red" w="70%" size="lg" onClick={handleCancel}>取消</Button>
      </VStack>
    </>
  );
}

export default Scan;
