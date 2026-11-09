import { useState, useCallback, useEffect } from 'react';

import { Button, Portal, Flex, Dialog } from '@chakra-ui/react';

import { FieldInput, SelectField } from '..';

import { useFieldsTouched } from '../../../hooks/useFieldsTouched';

import { getLabelWithoutUnits } from '../../../utils';
import { CONSTANTS } from './CONSTANTS';

export const FormDialog = ({
  isOpen = false,
  setIsOpen = () => {},
  form = {},
  setForm = () => {},
  handleChange = () => {},
  closeDialog = () => {},
  handleSubmit = () => {},
  headerItems = [],
  selectionOptions = {},
  submitText = CONSTANTS.Save,
  cancelText = CONSTANTS.Cancel,
  stripUnitsFromLabel = false,
}) => {
  const [isValid, setIsValid] = useState(true);

  const { handleBlur, getVisibleError, submitAttempt } =
    useFieldsTouched(isOpen);

  const isFieldRequired = (key) =>
    !!headerItems.find((item) => key === item.key)?.required ||
    CONSTANTS.RequiredKeys.includes(key);

  const handleFormSubmit = () => {
    if (!isValid) {
      submitAttempt();
      return;
    }

    handleSubmit();
  };

  const getFieldError = useCallback(
    (key) => {
      const headerItem = headerItems.find((item) => key === item.key);
      const value = form[key];

      if (key === 'limit_liters' || key === 'liters') {
        if (!value) return CONSTANTS.RequiredField;
        if (Number(value) <= 0) return CONSTANTS.BiggerThenZeroErr;
        return '';
      }

      if (key === 'license_plate') {
        if (!value) return CONSTANTS.RequiredField;

        const plate = value.trim().toUpperCase();

        if (plate.length < 3 || plate.length > 8) {
          return 'Номерний знак повинен містити від 3 до 8 символів';
        }

        if (!CONSTANTS.regex.test(plate)) {
          return 'Невірний формат номерного знаку';
        }

        return '';
      }

      if (headerItem?.required) {
        if (!value) return CONSTANTS.RequiredField;
      }

      return '';
    },
    [headerItems, form]
  );

  useEffect(() => {
    const isValidForm = headerItems.every(({ key }) => !getFieldError(key));
    setIsValid(isValidForm);
  }, [headerItems, form, getFieldError]);

  const hasSelectionOptions =
    selectionOptions && Object.keys(selectionOptions).length > 0;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => !open && closeDialog()}
      closeOnEscape
      closeOnInteractOutside={true}
      trapFocus
      restoreFocus={false}
      placement='center'
      motionPreset='slide-in-bottom'>
      <Portal>
        <Dialog.Backdrop backdropFilter='blur(8px)' />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body>
              <Flex direction='column' gap={4} mt={4}>
                {headerItems.map(({ label, type, key }) => {
                  const value = form[key] ?? '';
                  if (
                    hasSelectionOptions &&
                    selectionOptions[key] &&
                    Array.isArray(selectionOptions[key].items)
                  ) {
                    return (
                      <SelectField
                        key={key}
                        label={label}
                        value={value}
                        collection={selectionOptions[key]}
                        onChange={(newValue) => {
                          setForm((prev) => ({ ...prev, [key]: newValue }));
                        }}
                      />
                    );
                  }
                  const fieldError = getVisibleError(key, getFieldError(key));

                  return (
                    <FieldInput
                      key={key}
                      label={
                        stripUnitsFromLabel
                          ? getLabelWithoutUnits(label)
                          : label
                      }
                      name={key}
                      type={type || 'text'}
                      value={value}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required={isFieldRequired(key)}
                      invalid={!!fieldError}
                      errorText={fieldError}
                    />
                  );
                })}
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant='outline' onClick={closeDialog}>
                {cancelText}
              </Button>
              <Button
                border='1px solid'
                borderColor='gray.400'
                boxShadow='md'
                _hover={{ bg: 'gray.100', color: 'gray.900' }}
                onClick={handleFormSubmit}>
                {submitText}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
