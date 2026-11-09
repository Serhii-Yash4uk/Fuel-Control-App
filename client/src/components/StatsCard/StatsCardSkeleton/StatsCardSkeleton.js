import { Flex, Box, Skeleton } from '@chakra-ui/react';

export const StatsCardSkeleton = ({ rows = 2 }) => (
  <Box
    bg='white'
    py={{ base: 6, md: 6 }}
    px={{ base: 4, md: 8 }}
    borderRadius='lg'
    boxShadow='md'
    minW={0}
    flex='1 1 320px'
    maxH={{ base: 'fit-content', lg: '320px' }}
    display='flex'
    flexDirection='column'>
    <Skeleton height='28px' width='40%' mb={6} borderRadius='md' />
    <Flex direction='column' gap={0} divideY='1px'>
      {[...Array(rows)].map((_, idx) => (
        <Flex key={idx} align='center' justify='space-between' py={4} px={1}>
          <Flex align='center' gap={2}>
            <Skeleton boxSize={6} borderRadius='full' />
            <Skeleton height='24px' width='140px' borderRadius='sm' />
          </Flex>
          <Skeleton height='24px' width='80px' borderRadius='sm' />
        </Flex>
      ))}
    </Flex>
  </Box>
);
