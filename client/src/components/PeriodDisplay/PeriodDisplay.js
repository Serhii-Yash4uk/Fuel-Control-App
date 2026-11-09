import { Flex, Text } from '@chakra-ui/react';

import { formatDateForAccounting } from '../../utils';

export const PeriodDisplay = ({ dateRange }) => {
  if (!dateRange?.[0] || !dateRange?.[1]) return null;

  return (
    <Flex align='center' justify='flex-start' mb={4} maxW='fit-content' gap={2}>
      <Text fontSize='lg' fontWeight='semibold' color='gray.700'>
        Період:
      </Text>
      <Text fontSize='lg' fontWeight='medium' color='gray.600'>
        {formatDateForAccounting(dateRange[0])} –{' '}
        {formatDateForAccounting(dateRange[1])}
      </Text>
    </Flex>
  );
};
