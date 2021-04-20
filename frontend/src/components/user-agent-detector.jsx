import { useEffect, useState } from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, HStack, Box, Heading, Text, VStack } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import UAParser from 'ua-parser-js';

function getRecommendedBrowser(os, browser) {
  const osName = os.name.toLowerCase();
  const browserName = browser.name.toLowerCase();

  if (osName === 'ios') {
    const osVersion = parseFloat(os.version);

    if (osVersion >= 14.3) {
      return null;
    }

    if (osVersion < 11) {
      return '升級 iOS 到最新版';
    }

    if (browserName.indexOf('safari') === -1) {
      return 'Safari';
    }
  }

  if (osName === 'android') {
    if (browserName.indexOf('chrome') === -1) {
      return 'Chrome';
    }
  }

  return null;
}

function UserAgentDetector() {
  const [browser, setBrowser] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [detected, setDetected] = useState(false);
  const [recommended, setRecommended] = useState(null);

  useEffect(() => {
    const parser = new UAParser();
    console.log(parser.getResult());

    const operatingSystem = parser.getOS();
    const userBrowser = parser.getBrowser();

    setPlatform(operatingSystem);
    setBrowser(userBrowser);
    setRecommended(getRecommendedBrowser(operatingSystem, userBrowser));

    setDetected(true);
  }, []);

  if (!detected) {
    return null;
  }

  return (
    <Drawer isOpen={recommended} placement="bottom">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerBody>
            <HStack spacing="4" alignItems="start" py="3">
              <Box>
                <WarningTwoIcon color="red" />
              </Box>

              <Box>
                <VStack spacing="4" alignItems="stretch">
                  <VStack spacing="2" alignItems="stretch">
                    <Heading fontSize="lg">不支援的瀏覽器</Heading>
                    <Text>很抱歉，LINER Eats 和你的瀏覽器並不相容，請改用下面建議的瀏覽器繼續。</Text>
                  </VStack>

                  <Text fontSize="lg">{recommended}</Text>

                  <VStack alignItems="stretch" spacing="1">
                    <Heading fontSize="sm">詳細環境資訊</Heading>

                    <VStack alignItems="stretch" spacing="0">
                      <HStack>
                        <Heading fontSize="xs" w="55px">作業系統</Heading>
                        <Text fontSize="sm">{platform.name} {platform.version}</Text>
                      </HStack>
                      <HStack>
                        <Heading fontSize="xs" w="55px">瀏覽器</Heading>
                        <Text fontSize="sm">{browser.name} {browser.version}</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </Box>
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

export default UserAgentDetector;
