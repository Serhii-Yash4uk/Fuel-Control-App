import { NavLink as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';

export const NavLink = ({ children, to, ...props }) => (
  <Link
    asChild
    px={3}
    py={1}
    fontSize='md'
    rounded='lg'
    color='gray.300'
    fontWeight='semibold'
    textDecoration='none'
    transition='background-color 0.2s, color 0.2s'
    _hover={{
      bg: 'whiteAlpha.200',
      color: 'white',
      textDecoration: 'none',
    }}
    _focusVisible={{
      outline: '2px solid',
      outlineColor: 'teal.400',
      outlineOffset: '2px',
    }}
    _currentPage={{
      bg: 'white',
      color: 'gray.900',
      _hover: { bg: 'gray.200', color: 'gray.900' },
    }}
    {...props}>
    <RouterLink to={to}>{children}</RouterLink>
  </Link>
);
