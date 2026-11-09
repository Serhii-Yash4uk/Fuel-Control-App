import { Box, Stack, Skeleton, Flex, Badge } from '@chakra-ui/react';

const skeletonConfigs = {
  users: () => (
    <Flex align='center' gap={3}>
      <Skeleton boxSize={10} borderRadius='full' />
      <Stack gap={1}>
        <Skeleton height='20px' width='120px' />
        <Skeleton height='16px' width='80px' />
      </Stack>
    </Flex>
  ),
  fuelTanks: () => (
    <Box>
      <Flex align='center' gap={3} mb={2}>
        <Skeleton boxSize={10} borderRadius='full' />
        <Stack gap={1}>
          <Skeleton height='20px' width='120px' />
          <Flex align='center' gap={2}>
            <Skeleton height='18px' width='100px' />
            <Badge>
              <Skeleton height='18px' width='90px' />
            </Badge>
          </Flex>
        </Stack>
        <Flex ml='auto' gap={2} flexDirection='column'>
          <Skeleton height='32px' width='full' borderRadius='md' />
          <Flex ml='auto' gap={2}>
            <Skeleton height='32px' width='90px' borderRadius='md' />
            <Skeleton height='32px' width='90px' borderRadius='md' />
          </Flex>
        </Flex>
      </Flex>

      <Box pl={8} mt={4}>
        <Skeleton height='16px' width='140px' mb={1} />
        <Box p={3} borderRadius='md'>
          <Flex align='center' gap={3}>
            <Skeleton boxSize={8} borderRadius='full' />
            <Stack gap={1}>
              <Skeleton height='20px' width='60px' />
              <Flex align='center' gap={2}>
                <Skeleton height='16px' width='80px' />
                <Badge>
                  <Skeleton height='16px' width='110px' />
                </Badge>
              </Flex>
            </Stack>
            <Flex ml='auto' gap={2}>
              <Skeleton height='32px' width='38px' borderRadius='md' />
              <Skeleton height='32px' width='38px' borderRadius='md' />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  ),
  cards: () => (
    <Flex align='center' gap={3}>
      <Skeleton boxSize={10} borderRadius='md' />
      <Stack gap={1}>
        <Skeleton height='25px' width='200px' />
      </Stack>
    </Flex>
  ),
  limits: () => (
    <Flex align='center' gap={3} py='2'>
      <Skeleton boxSize={10} borderRadius='full' />
      <Stack gap={1}>
        <Flex align='center' gap={4} direction='row'>
          <Skeleton height='20px' width='120px' />{' '}
          <Badge>
            <Skeleton height='20px' width='90px' />
          </Badge>
        </Flex>
        <Skeleton height='16px' width='80px' />
        <Skeleton height='16px' width='60px' />
        <Skeleton height='16px' width='40px' />
        <Skeleton mt='2' height='14px' width='120px' />
        <Skeleton mt='2' height='14px' width='120px' />
      </Stack>
    </Flex>
  ),
  receipts: () => (
    <Flex gap={3} py='4' flexDirection='column'>
      <Flex align='center' gap={3} mb={2}>
        <Skeleton boxSize={10} borderRadius='md' />
        <Skeleton height='20px' width='160px' />
        <Badge>
          <Skeleton height='20px' width='120px' />
          <Skeleton height='20px' width='60px' />
        </Badge>
      </Flex>
      <Stack gap={2}>
        <Skeleton height='16px' width='100px' />
        <Skeleton height='16px' width='100px' />
        <Skeleton height='16px' width='100px' />
        <Skeleton height='16px' width='120px' />
        <Skeleton height='16px' width='100px' />

        <Skeleton mt='2' height='14px' width='120px' />
        <Skeleton mt='2' height='14px' width='120px' />
      </Stack>
    </Flex>
  ),
  fuelings: () => (
    <Flex gap={3} py='4' flexDirection='column'>
      <Flex align='center' gap={3} mb={2}>
        <Skeleton boxSize={10} borderRadius='md' />
        <Skeleton height='20px' width='160px' />
        <Badge>
          <Skeleton height='20px' width='120px' />
        </Badge>
      </Flex>
      <Stack gap={2}>
        <Skeleton height='16px' width='100px' />
        <Skeleton height='16px' width='100px' />
        <Skeleton height='16px' width='100px' />
        <Skeleton height='16px' width='100px' />
        <Skeleton height='16px' width='120px' />

        <Skeleton mt='2' height='14px' width='120px' />
      </Stack>
    </Flex>
  ),
};

const headerConfigs = {
  users: () => (
    <Flex justify='space-between' align='center' mb={6} gap={4} flexWrap='wrap'>
      <Skeleton height='32px' width='120px' borderRadius='md' />
      <Skeleton height='36px' width='180px' borderRadius='md' />
    </Flex>
  ),
  fuelTanks: () => (
    <Flex justify='space-between' align='center' mb={6} gap={4} flexWrap='wrap'>
      <Skeleton height='32px' width='100px' borderRadius='md' />
      <Skeleton height='36px' width='120px' borderRadius='md' />
    </Flex>
  ),
  cards: () => (
    <Flex justify='space-between' align='center' mb={6} gap={4} flexWrap='wrap'>
      <Skeleton height='32px' width='70px' borderRadius='md' />
      <Skeleton height='36px' width='130px' borderRadius='md' />
    </Flex>
  ),
  receipts: () => (
    <Flex justify='space-between' align='center' mb={6} gap={4} flexWrap='wrap'>
      <Skeleton height='32px' width='220px' borderRadius='md' />
    </Flex>
  ),
  fuelings: () => (
    <Flex justify='space-between' align='center' mb={6} gap={4} flexWrap='wrap'>
      <Skeleton height='32px' width='220px' borderRadius='md' />
    </Flex>
  ),
  limits: () => (
    <Flex justify='space-between' align='center' mb={6} gap={4} flexWrap='wrap'>
      <Skeleton height='32px' width='180px' borderRadius='md' />
      <Skeleton height='36px' width='130px' borderRadius='md' />
    </Flex>
  ),
};

export const AdminEntitySkeleton = ({ type = 'users', count = 5 }) => (
  <Box p={{ base: 4, md: 6 }} m='1' bg='white' borderRadius='lg' boxShadow='md'>
    {headerConfigs[type] ? headerConfigs[type]() : headerConfigs['users']()}
    <Stack gap={4}>
      {Array.from({ length: count }).map((_, idx) => (
        <Box key={idx} p={2} borderRadius='md' bg='gray.50' boxShadow='sm'>
          {skeletonConfigs[type]
            ? skeletonConfigs[type]()
            : skeletonConfigs['users']()}
        </Box>
      ))}
    </Stack>
  </Box>
);
