import { useEffect, useState } from 'react';
import { Box, Text, Container, VStack, Heading, Button, HStack, Avatar, Spacer, Stat, StatLabel, StatNumber, Center, Link as ChakraLink, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useClipboard, useToast } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { Link } from '@reach/router';
import { BeatLoader } from 'react-spinners';
import { Helmet } from 'react-helmet';
import QRCode from 'qrcode.react';

import LogoHorizontal from '../components/logo-horizontal';
import { ReactComponent as ShareIOSIcon } from '../components/share-ios.svg';
import { ReactComponent as GitHubIcon } from '../components/github.svg';
import { useAuth } from '../hooks/auth';

function Main() {
  const { hasCopied, onCopy } = useClipboard('https://linereats.web.app');
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const { user, loading } = useAuth();
  const toast = useToast();

  console.log('Main:currentUser', user);

  const handleShareButtonClick = () => {
    setShareSheetOpen(true);
  };

  const handleShareButtonClose = () => {
    setShareSheetOpen(false);
  };

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: '網址複製完成！貼給好友分享吧！🎉',
        status: 'success',
        duration: 3000,
      });
    }
  }, [toast, hasCopied]);

  if (loading || !user) {
    return (
      <Container>
        <Helmet>
          <title>LINER Eats</title>
        </Helmet>

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
      <Helmet>
        <title>LINER Eats</title>
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
          <Heading mb={10}>歡迎！</Heading>

          <Stat>
            <StatLabel>剩餘點數</StatLabel>
            <StatNumber fontSize="4xl">{user.points}</StatNumber>
          </Stat>

          <VStack alignItems="stretch" mt="8">
            <Button as={Link} size="lg" colorScheme="green" to="scan">掃描條碼</Button>
            <Text fontSize="sm" textAlign="center">請確認瀏覽器有開啟相機權限</Text>
          </VStack>

          <VStack mt="8">
            <HStack spacing="6">
              <ChakraLink onClick={handleShareButtonClick}>
                <ShareIOSIcon style={{width: 24, height: 24}} />
              </ChakraLink>

              <ChakraLink href="https://github.com/happydenn/linereats" isExternal>
                <GitHubIcon style={{width: 24, height: 24}} />
              </ChakraLink>
            </HStack>
          </VStack>
        </Box>
      </VStack>

      <Drawer isOpen={shareSheetOpen} placement="bottom" onOverlayClick={handleShareButtonClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerBody>
              <VStack spacing="3" py="5">
                <Text>把 LINER Eats 分享給好友吧！</Text>
                <QRCode value="https://linereats.web.app" size={180} />
                <ChakraLink textColor="gray" onClick={() => { onCopy(); setShareSheetOpen(false); }}>
                  <HStack spacing="0.5">
                    <Text>https://linereats.web.app</Text>
                    <CopyIcon />
                  </HStack>
                </ChakraLink>
                <Button w="50%" onClick={handleShareButtonClose}>關閉</Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Container>
  );
}

export default Main;
