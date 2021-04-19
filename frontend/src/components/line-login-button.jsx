import { Button, HStack, Box } from '@chakra-ui/react';
import { ReactComponent as LabrLineMessengerAlt } from './line-messenger-alt.svg';

function LineLoginButton({ ...props }) {
  return (
    <Button
      bg="#00c300"
      color="white"
      _hover={{bg: '#00e000'}}
      _active={{bg: '#00b300'}}
      _disabled={{bg: '#c6c6c6'}}
      {...props}
    >
      <HStack spacing="3.5">
        <Box sx={{transform: 'scale(1.5)'}}>
          <LabrLineMessengerAlt fill="currentColor" style={{width: 16, height: 16}} />
        </Box>
        <Box>Log in with LINE</Box>
      </HStack>
    </Button>
  );
}

export default LineLoginButton;
