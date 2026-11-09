import { useState } from 'react';

import { Box, Stack, Flex, Icon, Text, Input, Button } from '@chakra-ui/react';
import { FaClock, FaGasPump } from 'react-icons/fa';

import { SelectField } from '../common';

export const SaleFuelingCard = ({
  fueling,
  onSave,
  cardsCollection,
  isSaving = false,
  error,
}) => {
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState(fueling.comment || '');
  const [driver, setDriver] = useState('');
  const [touched, setTouched] = useState({ amount: false, driver: false });

  const isAmountValid = fueling.driver ? !!amount && Number(amount) > 0 : true;
  const isDriverValid = !fueling.driver ? !!driver : true;
  const isButtonDisabled = !isAmountValid || !isDriverValid || isSaving;

  const handleSelectChange = (val) => {
    setDriver(val);
    setTouched((t) => ({ ...t, driver: true }));
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value.replace(/[^0-9.]/g, ''));
    setTouched((t) => ({ ...t, amount: true }));
  };

  const handleSave = () => {
    setTouched({ amount: true, driver: true });

    if (isButtonDisabled) return;

    onSave({
      ...fueling,
      amount_uah: amount === '' ? null : amount,
      comment,
      ...(!fueling.driver && { driver }),
    });
  };

  return (
    <Box
      borderWidth='1'
      borderRadius='lg'
      p='5'
      bg='white'
      boxShadow='lg'
      mx='auto'
      w={{ base: '100%', sm: '90%', md: '60%', xl: '50%' }}>
      <Stack spacing={2}>
        <Flex align='center' gap={2}>
          <Icon as={FaClock} color='gray.400' boxSize='5' />
          <Text fontSize='xl' color='gray.600'>
            {fueling.dateTime}
          </Text>
        </Flex>
        <Flex align='center' gap={2}>
          <Icon as={FaGasPump} color='gray.400' boxSize='5' />
          <Text fontSize='xl' color='gray.600'>
            {fueling.azs}
          </Text>
        </Flex>
        <Flex align='center' gap={2}>
          <Icon as={FaGasPump} color='gray.400' boxSize='5' />
          <Text fontSize='xl' color='gray.600'>
            {fueling.liters} л
          </Text>
        </Flex>

        {!fueling.driver && (
          <>
            <SelectField
              label='Картка'
              value={driver}
              collection={cardsCollection}
              isLabelVisible={false}
              onChange={handleSelectChange}
              placeholder='Оберіть картку'
              isDisabled={!cardsCollection.items.length}
              fullWidth
            />
            {touched.driver && !isDriverValid && (
              <Text color='red.500' fontSize='sm' mt={1}>
                Оберіть картку
              </Text>
            )}
            {!cardsCollection.items.length && (
              <Text color='gray.500' fontSize='sm' mt={1}>
                Немає доступних карток
              </Text>
            )}
          </>
        )}

        {fueling.driver && (
          <>
            <Input
              type='number'
              value={amount}
              onChange={handleAmountChange}
              placeholder='Сума (грн.)'
              mt='2'
              onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
              min='1'
            />
            {touched.amount && !isAmountValid && (
              <Text color='red.500' fontSize='sm' mt='1'>
                Введіть коректну суму
              </Text>
            )}
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Коментар'
            />
          </>
        )}

        <Button
          size='sm'
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isButtonDisabled}
          mt='2'>
          Зберегти
        </Button>
        {error && (
          <Text color='red.500' fontSize='sm'>
            {error}
          </Text>
        )}
      </Stack>
    </Box>
  );
};
