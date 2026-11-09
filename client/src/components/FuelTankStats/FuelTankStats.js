import { Box, Flex, Heading, Button, Text, Icon } from '@chakra-ui/react';
import { FaOilCan, FaExclamationTriangle } from 'react-icons/fa';
import { MdLocalGasStation } from 'react-icons/md';
import { BsFillPieChartFill } from 'react-icons/bs';
import { FaMoneyBillWave } from 'react-icons/fa';

import { FuelTankStatsSkeleton, FuelTankProgress } from '../../components';

import { CONSTANTS } from './CONSTANTS';

const statIcons = {
  tankCapacity: MdLocalGasStation,
  currentBalance: FaOilCan,
  fillPercentage: BsFillPieChartFill,
  warningThreshold: FaExclamationTriangle,
  averagePrice: FaMoneyBillWave,
};

export const FuelTankStats = ({
  stats = {},
  fuelTankStatsData = [],
  isLoading = false,
  setIsOpen = () => {},
}) => (
  <Flex
    direction={{ base: 'column', xl: 'row' }}
    mx='auto'
    flex='0 1 60%'
    maxW='4xl'
    w={{ base: '100%', md: '80%', xl: '70%' }}
    justify='center'>
    <Box
      bg='white'
      py={8}
      px={{ base: 4, md: 8 }}
      borderRadius='lg'
      boxShadow='lg'
      minW={0}
      color='gray.700'
      flex='1 1 380px'
      display='flex'
      flexDirection='column'
      alignItems='stretch'>
      {isLoading && <FuelTankStatsSkeleton />}
      {!isLoading && (
        <>
          <Heading textStyle='2xl' fontWeight='bold' mb={4}>
            {stats.tankName}
          </Heading>

          <Flex direction='column' divideY='1px' borderColor='gray.100'>
            {fuelTankStatsData.map(({ key, label, value }) => {
              let iconProps = { boxSize: 5, color: 'gray.400' };

              if (
                key === 'warningThreshold' &&
                Number(stats.fillPercentage) <= stats.warningThreshold
              ) {
                iconProps = { boxSize: 8, color: 'red.500' };
              }
              return (
                <Flex
                  key={key}
                  align='center'
                  justify='space-between'
                  py={3}
                  px={1}>
                  <Flex align='center' gap={3}>
                    <Icon as={statIcons[key]} {...iconProps} />
                    <Text>{label}</Text>
                  </Flex>
                  <Text textStyle='xl'>{value}</Text>
                </Flex>
              );
            })}
          </Flex>

          <FuelTankProgress
            fillPercentage={stats.fillPercentage}
            warningThreshold={stats.warningThreshold}
            progressTrackSize={{ base: 4, md: 5 }}
          />
        </>
      )}

      <Box textAlign='center'>
        <Button
          w={{ base: '60%', sm: '40%' }}
          size={{ base: 'sm', md: 'md', xl: 'lg' }}
          textTransform='uppercase'
          fontWeight='bold'
          border='1px solid'
          borderColor='gray.400'
          boxShadow='md'
          _hover={{ bg: 'gray.100', color: 'gray.900' }}
          onClick={() => setIsOpen(true)}>
          {CONSTANTS.AddFuel}
        </Button>
      </Box>
    </Box>
  </Flex>
);
