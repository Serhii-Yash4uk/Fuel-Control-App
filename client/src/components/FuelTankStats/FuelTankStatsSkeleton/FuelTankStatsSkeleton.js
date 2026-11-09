import { Flex, Skeleton } from '@chakra-ui/react';

import { FuelTankProgressSkeleton } from '../../FuelTankProgress';

export const FuelTankStatsSkeleton = ({ countOfElements = 4 }) => (
  <Flex direction='column' divideY='1px' borderColor='gray.100'>
    <Skeleton height='36px' width='140px' mb={4} borderRadius='md' />

    {[...Array(countOfElements)].map((_, idx) => (
      <Flex
        key={idx}
        align='center'
        justify='space-between'
        py={3}
        px={1}
        gap={2}>
        <Flex align='center' gap={3}>
          <Skeleton boxSize={6} borderRadius='full' />
          <Skeleton height='24px' width='160px' borderRadius='sm' />
        </Flex>
        <Skeleton height='30px' width='100px' borderRadius='sm' />
      </Flex>
    ))}
    <FuelTankProgressSkeleton />
  </Flex>
);
