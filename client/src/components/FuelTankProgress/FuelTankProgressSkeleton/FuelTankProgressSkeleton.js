import { Box, Skeleton, HStack } from '@chakra-ui/react';

export const FuelTankProgressSkeleton = () => (
  <Box py={6}>
    <HStack gap={2} w='100%'>
      <Skeleton height='20px' width='100px' borderRadius='sm' />
      <Skeleton height='20px' width='100%' borderRadius='0' flex='1' />
      <Skeleton height='20px' width='80px' borderRadius='sm' />
    </HStack>
  </Box>
);
