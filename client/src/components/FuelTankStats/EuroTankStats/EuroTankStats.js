import { Box, Flex, Heading, Text, Icon } from '@chakra-ui/react';
import { FaOilCan } from 'react-icons/fa';
import { MdLocalGasStation } from 'react-icons/md';
import { FuelTankStatsSkeleton, FuelTankProgress } from '../../../components';

const statIcons = {
  tankCapacity: MdLocalGasStation,
  currentBalance: FaOilCan,
};

export const EuroTankStats = ({
  isLoading = false,
  euroStats = [],
  tankName = '',
  fillPercentage = 0,
  threshold = 0,
  alignSelf = 'end',
  flex = '0 1 40%',
  w = { base: '100%', md: '60%', '2xl': '60%' },
}) => (
  <Flex
    bg='white'
    flex={flex}
    w={w}
    color='gray.700'
    flexDirection='column'
    alignItems='stretch'
    alignSelf={alignSelf}>
    <Box
      bg='white'
      py={8}
      px={{ base: 4, md: 8 }}
      borderRadius='lg'
      boxShadow='lg'
      color='gray.700'
      display='flex'
      flexDirection='column'
      alignItems='stretch'>
      {isLoading && (
        <FuelTankStatsSkeleton countOfElements={euroStats.length} />
      )}

      {!isLoading && (
        <>
          <Heading textStyle='2xl' fontWeight='bold' mb={4}>
            {tankName}
          </Heading>
          <Flex direction='column' divideY='1px' borderColor='gray.100'>
            {euroStats
              .filter(({ key }) => key !== 'tankName')
              .map(({ key, label, value }) => (
                <Flex
                  key={key}
                  align='center'
                  justify='space-between'
                  py={3}
                  px={1}>
                  <Flex align='center' gap={3}>
                    <Icon
                      as={statIcons[key] || FaOilCan}
                      boxSize={5}
                      color='gray.400'
                    />
                    <Text>{label}</Text>
                  </Flex>
                  <Text textStyle='xl'>{value}</Text>
                </Flex>
              ))}
          </Flex>

          <FuelTankProgress
            fillPercentage={fillPercentage}
            warningThreshold={threshold}
            progressTrackSize='4'
          />
        </>
      )}
    </Box>
  </Flex>
);
