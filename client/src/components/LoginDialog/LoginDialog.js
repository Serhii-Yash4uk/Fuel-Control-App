import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Portal,
  Flex,
  Dialog,
  Field,
  Input,
  Text,
  Spinner,
  VStack,
  InputGroup,
  Icon,
  Button,
} from '@chakra-ui/react';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import {
  login,
  selectAuthLoadingStatus,
  selectAuthErrorMessage,
  selectIsLoggedIn,
  selectUsersErrorMessage,
} from '../../redux';

export const LoginDialog = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loading = useSelector(selectAuthLoadingStatus);
  const authError = useSelector(selectAuthErrorMessage);
  const userError = useSelector(selectUsersErrorMessage);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ type: '', message: '' });

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      setError({ type: '', message: '' });
      dispatch(login({ username, password }));
    },
    [dispatch, username, password]
  );

  const handleDialogClose = useCallback(() => {
    setUsername('');
    setPassword('');
    setError({ type: '', message: '' });
  }, []);

  useEffect(() => {
    if (authError) {
      setError({ type: 'auth', message: authError });
    } else if (userError) {
      setError({ type: 'user', message: userError });
    }
  }, [authError, userError]);

  return (
    <Dialog.Root
      open={!isLoggedIn}
      closeOnEscape
      closeOnInteractOutside
      trapFocus
      placement='center'
      motionPreset='slide-in-top'>
      <Portal>
        <Dialog.Backdrop backdropFilter='blur(8px)' />
        <Dialog.Positioner>
          <Dialog.Content
            w='100%'
            maxW={{ base: '100vw', sm: '400px' }}
            minH={{ base: '100vh', sm: 'auto' }}
            pt={{ base: '4', sm: '0' }}
            display='flex'
            flexDirection='column'
            justifyContent='center'>
            <Dialog.Body>
              {error.message && (
                <Flex
                  align='center'
                  bg='red.50'
                  border='1px solid'
                  borderColor='red.200'
                  color='red.600'
                  borderRadius='md'
                  px={3}
                  py={2}
                  mb={3}
                  w='100%'>
                  <Text fontSize='sm'>{error.message}</Text>
                </Flex>
              )}
              <form onSubmit={handleLogin}>
                <Flex direction='column' gap={4} mt={4}>
                  <Field.Root label='Username'>
                    <Field.Label>Користувач</Field.Label>
                    <Input
                      name='username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder='Користувач'
                      required
                      disabled={loading}
                    />
                  </Field.Root>

                  <Field.Root label='Password'>
                    <Field.Label>Пароль</Field.Label>
                    <InputGroup>
                      <>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          name='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder='Пароль'
                          required
                          disabled={loading}
                        />
                        <Icon
                          as={showPassword ? FaEye : FaEyeSlash}
                          position='absolute'
                          top='50%'
                          transform='translateY(-50%)'
                          right='2'
                          size='sm'
                          color='gray.500'
                          cursor='pointer'
                          onClick={() => setShowPassword((prev) => !prev)}
                        />
                      </>
                    </InputGroup>
                  </Field.Root>

                  {loading && (
                    <VStack
                      position='absolute'
                      top='50%'
                      left='50%'
                      transform='translate(-50%, -50%)'
                      align='center'
                      gap={2}>
                      <Spinner size='xl' />
                      <Text fontSize='xl'>Вхід...</Text>
                    </VStack>
                  )}
                </Flex>
                <Flex mt={8} gap={2} justify='flex-end'>
                  <Button
                    variant='outline'
                    onClick={handleDialogClose}
                    disabled={loading}
                    w='40%'>
                    Скасувати
                  </Button>
                  <Button
                    type='submit'
                    border='1px solid'
                    borderColor='gray.400'
                    boxShadow='md'
                    _hover={{ bg: 'gray.100', color: 'gray.900' }}
                    isLoading={loading}
                    disabled={loading}
                    w='40%'>
                    Увійти
                  </Button>
                </Flex>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
