import { Image } from '@chakra-ui/react';
import logo from './logo-stacked-white.svg';

function LogoStackedWhite() {
  return <Image src={logo} objectFit="cover" boxSize="256px" h="160px" />;
}

export default LogoStackedWhite;
