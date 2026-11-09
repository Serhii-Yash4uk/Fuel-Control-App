import { Alert } from '@chakra-ui/react';

export const ErrorAlert = ({
  title = 'Щось пішло не так. Перезавантажте сторінку або повторіть спробу.',
  ...props
}) => (
  <Alert.Root
    status='error'
    mb={4}
    variant='surface'
    borderStartWidth='4px'
    borderStartColor='colorPalette.solid'
    {...props}>
    <Alert.Indicator />
    <Alert.Title>{title}</Alert.Title>
  </Alert.Root>
);
