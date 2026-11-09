import {
  Box,
  Button,
  Input,
  Field,
  Flex,
  InputGroup,
  Dialog,
  Portal,
} from '@chakra-ui/react';

import { useFieldsTouched } from '../../hooks/useFieldsTouched';

const BIGGER_THEN_ZERO_ERR = 'Значення повинно бути більше 0';
const ONLY_INTEGER_ERR = 'Значення повинно бути цілим числом';
const REQUIRED_ERR = 'Поле обов’язкове';
const REFILL_BUTTON_TEXT = 'Поповнити';
const CLOSE_BUTTON_VALUE = '✕';

export const RefillFuelTankDialog = ({
  setIsOpen,
  isOpen,
  onChange,
  handleAddSubmit,
  handleClose,
  tableHeaderItems = [],
  formValues = {},
}) => {
  const { handleBlur, getVisibleError, submitAttempt } =
    useFieldsTouched(isOpen);

  const fields = tableHeaderItems.map((item) => {
    let startAddon = '';
    let endAddon = '';
    let placeholder = '';

    switch (item.key) {
      case 'liters':
        startAddon = 'л';
        endAddon = 'ЛІТРИ';
        placeholder = '0';
        break;
      case 'price':
        startAddon = '₴';
        endAddon = 'ГРН/Л';
        placeholder = '0.00';
        break;
      case 'note':
        placeholder = 'Коментар';
        break;
      default:
        break;
    }

    return {
      ...item,
      startAddon,
      endAddon,
      placeholder,
      value: formValues[item.key] ?? '',
    };
  });

  const getLitersError = (value) => {
    if (value === '' || value === undefined) return REQUIRED_ERR;
    if (!/^\d+$/.test(value)) return ONLY_INTEGER_ERR;
    if (Number(value) <= 0) return BIGGER_THEN_ZERO_ERR;
    return '';
  };

  const handleSubmit = () => {
    if (getLitersError(formValues.liters)) {
      submitAttempt();
      return;
    }

    handleAddSubmit();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => !open && handleClose()}
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
            <Dialog.Body>
              <Button
                position='absolute'
                top={2}
                right={2}
                size='sm'
                variant='ghost'
                onClick={handleClose}>
                {CLOSE_BUTTON_VALUE}
              </Button>
              <Flex direction='column' gap={4} mt={12}>
                {fields.map(
                  ({
                    key,
                    label,
                    startAddon,
                    endAddon,
                    type,
                    value,
                    placeholder,
                  }) => {
                    const isLiters = key === 'liters';
                    const litersError = isLiters
                      ? getVisibleError(key, getLitersError(value))
                      : '';

                    return (
                      <Field.Root
                        key={key}
                        flex='1'
                        required={isLiters}
                        invalid={!!litersError}>
                        <Field.Label>
                          {label}
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <InputGroup startAddon={startAddon} endAddon={endAddon}>
                          <Input
                            name={key}
                            type={type}
                            value={value}
                            onChange={onChange}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                          />
                        </InputGroup>
                        {litersError && (
                          <Field.ErrorText>{litersError}</Field.ErrorText>
                        )}
                      </Field.Root>
                    );
                  },
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
                  {REFILL_BUTTON_TEXT}
                </Button>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
