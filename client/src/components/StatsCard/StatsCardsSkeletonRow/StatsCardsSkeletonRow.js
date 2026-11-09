import { Flex } from '@chakra-ui/react';

import { StatsCardSkeleton } from '../StatsCardSkeleton';

export const StatsCardsSkeletonRow = () => (
  <Flex
    mx='auto'
    mb={6}
    w='100%'
    flexDirection={{ base: 'column-reverse', lg: 'row' }}
    justify='center'
    gap={4}>
    <StatsCardSkeleton rows={2} />
    <StatsCardSkeleton rows={4} />
  </Flex>
);
