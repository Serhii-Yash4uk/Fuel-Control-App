import { useState, useEffect } from 'react';

import {
  Text,
  Flex,
  Button,
  Box,
  Portal,
  Dialog,
  Field,
  Input,
} from '@chakra-ui/react';

import { SelectField } from '../common';

import { useFieldsTouched } from '../../hooks/useFieldsTouched';

import { CONSTANTS } from './CONSTANTS';

export const EditCardDialog = ({
  isOpen,
  setIsOpen,
  onClose,
  onSubmit,
  initialValues = { cardName: '', type: 'FUEL' },
  isEdit = false,
}) => {
  const [form, setForm] = useState(initialValues);

  const { handleBlur, getVisibleError, submitAttempt } =
    useFieldsTouched(isOpen);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getCardNameError = (value) => (!value ? CONSTANTS.RequiredField : '');

  const isFormInvalid = !!getCardNameError(form.cardName);

  const handleSubmit = () => {
    if (isFormInvalid) {
      submitAttempt();
      return;
    }

    onSubmit(form);
  };

  const cardNameError = getVisibleError(
    'cardName',
    getCardNameError(form.cardName),
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
      motionPreset='slide-in-bottom'>
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
                {isEdit ? CONSTANTS.EditCard : CONSTANTS.CreateCard}
              </Text>
              <Flex direction='column' gap={4}>
                <Field.Root required invalid={!!cardNameError}>
                  <Field.Label>
                    {CONSTANTS.CardName}
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    name='cardName'
                    value={form.cardName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={CONSTANTS.CardName}
                  />
                  {cardNameError && (
                    <Field.ErrorText>{cardNameError}</Field.ErrorText>
                  )}
                </Field.Root>
                <Field.Root required>
                  <Field.Label>
                    Тип картки
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <SelectField
                    value={
                      CONSTANTS.CARD_TYPE_SELECTION.items.find(
                        (item) => item.value === form.type,
                      )?.label || ''
                    }
                    collection={CONSTANTS.CARD_TYPE_SELECTION}
                    isLabelVisible={false}
                    fullWidth
                    onChange={(label) => {
                      const found = CONSTANTS.CARD_TYPE_SELECTION.items.find(
                        (item) => item.label === label,
                      );
                      setForm((prev) => ({
                        ...prev,
                        type: found ? found.value : '',
                      }));
                    }}
                    isDisabled={!CONSTANTS.CARD_TYPE_SELECTION.items.length}
                  />
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
