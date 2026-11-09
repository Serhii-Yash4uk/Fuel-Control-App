import { Box, Flex, Skeleton, VStack } from '@chakra-ui/react';

const rows = 7;
const columns = 7;

export const DataGridSkeleton = () => (
  <Box
    borderWidth='1px'
    borderRadius='sm'
    bg='white'
    mb='12'
    overflowY='hidden'>
    <Flex borderBottom='1px solid' borderColor='gray.200' py='2'>
      {[...Array(columns)].map((_, idx) => (
        <Box key={idx} flex='1' px={2} py={2} minW='120px'>
          <Skeleton
            height='20px'
            width='80%'
            borderRadius='sm'
            variant='shine'
          />
        </Box>
      ))}
    </Flex>
    <VStack spacing={0} align='stretch' gap={0}>
      {[...Array(rows)].map((_, i) => (
        <Flex
          key={i}
          borderBottom={i === rows - 1 ? undefined : '1px solid'}
          borderColor='gray.100'
          align='center'
          minH='45px'>
          {[...Array(columns)].map((_, i) => (
            <Box key={i} flex='1' px={2} minW='120px'>
              <Skeleton
                height='20px'
                width='60%'
                borderRadius='md'
                variant='shine'
              />
            </Box>
          ))}
        </Flex>
      ))}
    </VStack>
  </Box>
);
