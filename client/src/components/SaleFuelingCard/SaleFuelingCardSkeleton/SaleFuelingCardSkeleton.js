import { Box, Stack, Flex, Skeleton } from '@chakra-ui/react';

export const SaleFuelingCardSkeleton = () => (
  <Box
    borderWidth={1}
    borderRadius='lg'
    p={5}
    bg='white'
    boxShadow='md'
    mx='auto'
    minW={{ base: '100%', sm: '620px' }}
    mb={4}>
    <Stack spacing={2}>
      <Flex align='center' gap={2}>
        <Skeleton boxSize={7} borderRadius='full' />
        <Skeleton height='30px' width='160px' borderRadius='md' />
      </Flex>
      <Flex align='center' gap={2}>
        <Skeleton boxSize={7} borderRadius='full' />
        <Skeleton height='30px' width='120px' borderRadius='md' />
      </Flex>
      <Flex align='center' gap={2}>
        <Skeleton boxSize={7} borderRadius='full' />
        <Skeleton height='30px' width='100px' borderRadius='md' />
      </Flex>
      <Skeleton height='36px' borderRadius='md' mt={2} />
      <Skeleton height='36px' borderRadius='md' />
      <Skeleton height='36px' borderRadius='md' mt={2} />
    </Stack>
  </Box>
);
