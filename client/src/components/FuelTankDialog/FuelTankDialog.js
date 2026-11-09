import { useState, useEffect } from 'react';

import {
  Flex,
  Text,
  Portal,
  Dialog,
  Input,
  Button,
  Box,
  Field,
} from '@chakra-ui/react';

import { SelectField } from '../common';

import { useFieldsTouched } from '../../hooks/useFieldsTouched';

const Close_Button_value = '✕';

export const FuelTankDialog = ({
  isOpen,
  setIsOpen,
  onClose,
  onSubmit,
  type = 'main',
  isEdit = false,
  cardsCollection,
  initialValues = {
    name: '',
    capacity: '',
    threshold: '',
    movingCard: '',
  },
}) => {
  const [form, setForm] = useState(initialValues);

  const { handleBlur, touchField, getVisibleError, submitAttempt } =
    useFieldsTouched(isOpen);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (val) => {
    setForm((prev) => ({ ...prev, movingCard: val }));
    touchField('movingCard');
  };

  const getNameError = (value) => (!value ? 'Поле обов’язкове' : '');
  const getCapacityError = (value) =>
    !value || isNaN(Number(value)) ? 'Вкажіть число' : '';
  const getMovingCardError = (value) =>
    type === 'connected' && !value ? 'Поле обов’язкове' : '';
  const getThresholdError = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    if (isNaN(Number(value))) return 'Вкажіть число';
    if (Number(value) > 50) return 'Максимальне значення - 50';
    return '';
  };

  const isFormInvalid =
    !!getNameError(form.name) ||
    !!getCapacityError(form.capacity) ||
    !!getThresholdError(form.threshold) ||
    (type === 'connected' && !!getMovingCardError(form.movingCard));

  const handleSubmit = () => {
    if (isFormInvalid) {
      submitAttempt();
      return;
    }

    onSubmit(form);
  };

  const nameError = getVisibleError('name', getNameError(form.name));
  const capacityError = getVisibleError(
    'capacity',
    getCapacityError(form.capacity),
  );
  const thresholdError = getVisibleError(
    'threshold',
    getThresholdError(form.threshold),
  );
  const movingCardError = getVisibleError(
    'movingCard',
    getMovingCardError(form.movingCard),
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
                {Close_Button_value}
              </Button>
              <Text fontWeight='bold' fontSize='lg' mb={6}>
                {isEdit
                  ? 'Редагувати бочку'
                  : type === 'main'
                    ? 'Створити головну бочку'
                    : 'Створити бочку для підключення'}
              </Text>
              <Flex direction='column' gap={4}>
                <Field.Root required invalid={!!nameError}>
                  <Field.Label>
                    Назва
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='Назва бочки'
                  />
                  {nameError && <Field.ErrorText>{nameError}</Field.ErrorText>}
                </Field.Root>
                <Field.Root required invalid={!!capacityError}>
                  <Field.Label>
                    Об'єм (л)
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    name='capacity'
                    type='number'
                    value={form.capacity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Об'єм"
                  />
                  {capacityError && (
                    <Field.ErrorText>{capacityError}</Field.ErrorText>
                  )}
                </Field.Root>
                <Field.Root invalid={!!thresholdError}>
                  <Field.Label>Поріг (необов'язково)</Field.Label>
                  <Input
                    name='threshold'
                    type='number'
                    value={form.threshold}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='Поріг попередження'
                  />
                  {thresholdError && (
                    <Field.ErrorText>{thresholdError}</Field.ErrorText>
                  )}
                </Field.Root>
                {type === 'connected' && (
                  <Field.Root required invalid={!!movingCardError}>
                    <Field.Label>
                      Картка переміщення
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <SelectField
                      value={form.movingCard}
                      collection={cardsCollection}
                      onChange={handleSelectChange}
                      placeholder='Оберіть картку'
                      isLabelVisible={false}
                      isDisabled={!cardsCollection.items.length}
                      fullWidth
                    />
                    {movingCardError && (
                      <Field.ErrorText>Оберіть картку</Field.ErrorText>
                    )}
                    {!cardsCollection.items.length && (
                      <Text color='gray.500' fontSize='sm' mt={1}>
                        Немає доступних карток
                      </Text>
                    )}
                  </Field.Root>
                )}
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
                  {isEdit ? 'Зберегти' : 'Створити'}
                </Button>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
