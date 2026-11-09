import { useState, useEffect } from 'react';

import {
  Text,
  Portal,
  Dialog,
  InputGroup,
  Field,
  Input,
  Flex,
  Button,
  Box,
  Icon,
} from '@chakra-ui/react';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { SelectField } from '../common';

import { useFieldsTouched } from '../../hooks/useFieldsTouched';

import { CONSTANTS } from './CONSTANTS';

export const EditUserDialog = ({
  isOpen,
  setIsOpen,
  onClose,
  onSubmit,
  initialValues = {
    username: '',
    password: '',
    role: '',
    displayName: '',
  },
  isRoleDisabled = false,
  isEdit = false,
}) => {
  const [form, setForm] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);

  const { handleBlur, touchField, getVisibleError, submitAttempt } =
    useFieldsTouched(isOpen);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getUsernameError = (value) => (!value ? CONSTANTS.RequiredField : '');
  const getPasswordError = (value) =>
    !value && !isEdit ? CONSTANTS.RequiredField : '';
  const getDisplayNameError = (value) =>
    !value ? CONSTANTS.RequiredField : '';
  const getRoleError = (value) => (!value ? CONSTANTS.RequiredField : '');

  const isFormInvalid =
    !!getUsernameError(form.username) ||
    !!getPasswordError(form.password) ||
    !!getDisplayNameError(form.displayName) ||
    (!isRoleDisabled && !!getRoleError(form.role));

  const handleSubmit = () => {
    if (isFormInvalid) {
      submitAttempt();
      return;
    }

    onSubmit(form);
  };

  const usernameError = getVisibleError(
    'username',
    getUsernameError(form.username),
  );
  const passwordError = getVisibleError(
    'password',
    getPasswordError(form.password),
  );
  const roleError = getVisibleError('role', getRoleError(form.role));
  const displayNameError = getVisibleError(
    'displayName',
    getDisplayNameError(form.displayName),
  );

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => !open && onClose()}
      closeOnEscape
      closeOnInteractOutside
      trapFocus
      restoreFocus={false}
      placement='center'
      motionPreset='slide-in-top'>
      <Portal>
        <Dialog.Backdrop backdropFilter='blur(8px)' />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body mt='4'>
              <Button
                position='absolute'
                top={2}
                right={2}
                size='sm'
                variant='ghost'
                onClick={onClose}>
                {CONSTANTS.Close_Button_value}
              </Button>
              <Text fontWeight='bold' fontSize='lg' mb={6}>
                {isEdit ? CONSTANTS.EditUser : CONSTANTS.CreateUser}
              </Text>
              <Flex direction='column' gap={4}>
                <Field.Root required invalid={!!usernameError}>
                  <Field.Label>
                    {CONSTANTS.User}
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    name='username'
                    value={form.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={CONSTANTS.User}
                  />
                  {usernameError && (
                    <Field.ErrorText>{usernameError}</Field.ErrorText>
                  )}
                </Field.Root>
                <Field.Root required={!isEdit} invalid={!!passwordError}>
                  <Field.Label>
                    {CONSTANTS.Passwrod}
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <InputGroup>
                    <>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={
                          isEdit
                            ? CONSTANTS.PasswordUnchanged
                            : CONSTANTS.Passwrod
                        }
                      />
                      <Icon
                        as={showPassword ? FaEye : FaEyeSlash}
                        position='absolute'
                        top='50%'
                        right={2}
                        transform='translateY(-50%)'
                        size='sm'
                        color='gray.500'
                        cursor='pointer'
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                    </>
                  </InputGroup>
                  {passwordError && (
                    <Field.ErrorText>{passwordError}</Field.ErrorText>
                  )}
                </Field.Root>

                {!isRoleDisabled && (
                  <Field.Root required invalid={!!roleError}>
                    <Field.Label>
                      {CONSTANTS.Role}
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <SelectField
                      value={
                        CONSTANTS.SELECTION_OPTIONS.items.find(
                          (item) => item.value === form.role,
                        )?.label || ''
                      }
                      collection={CONSTANTS.SELECTION_OPTIONS}
                      isLabelVisible={false}
                      fullWidth
                      onChange={(label) => {
                        const found = CONSTANTS.SELECTION_OPTIONS.items.find(
                          (item) => item.label === label,
                        );
                        setForm((prev) => ({
                          ...prev,
                          role: found ? found.value : '',
                        }));
                        touchField('role');
                      }}
                      isDisabled={!CONSTANTS.SELECTION_OPTIONS.items.length}
                    />
                    {roleError && <Field.ErrorText>{roleError}</Field.ErrorText>}
                  </Field.Root>
                )}

                <Field.Root required invalid={!!displayNameError}>
                  <Field.Label>
                    {CONSTANTS.UserName}
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    name='displayName'
                    value={form.displayName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={CONSTANTS.UserName}
                  />
                  {displayNameError && (
                    <Field.ErrorText>{displayNameError}</Field.ErrorText>
                  )}
                </Field.Root>
              </Flex>

              <Box minW={{ base: '100%', md: '128px' }} mt={8}>
                <Button
                  onClick={handleSubmit}
                  fontWeight='bold'
                  fontSize='md'
                  w='full'
                  border='1px solid'
                  borderColor='gray.400'
                  boxShadow='md'
                  _hover={{ bg: 'gray.100', color: 'gray.900' }}>
                  {isEdit ? CONSTANTS.Save : CONSTANTS.Create}
                </Button>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
