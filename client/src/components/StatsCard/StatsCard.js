import { Box, Heading, Flex, Icon, Text } from '@chakra-ui/react';

export const StatsCard = ({ title, stats, colors = {}, divideY = true }) => {
  const {
    bgTotal = 'blue.50',
    colorTotal = 'blue.700',
    iconColorTotal = 'blue.400',
  } = colors;

  return (
    <Box
      bg='white'
      py={{ base: 6, md: 6 }}
      px={{ base: 4, md: 8 }}
      maxH={{ base: 'fit-content', lg: '320px' }}
      borderRadius='lg'
      boxShadow='md'
      flex={{ base: '1 1 320px', lg: '1 1 400px' }}
      display='flex'
      flexDirection='column'>
      <Heading
        size='lg'
        fontWeight='bold'
        textAlign='left'
        mb={2}
        color='gray.700'>
        {title}
      </Heading>

      <Flex
        direction='column'
        {...(divideY ? { divideY: '1px', borderColor: 'gray.100' } : {})}
        borderColor='gray.100'
        gap={2}
        mt={4}>
        {stats.map(({ highlight, icon, label, value }) => {
          const isHighlight = highlight;
          const rowBg = isHighlight ? bgTotal : 'transparent';
          const rowColor = isHighlight ? colorTotal : 'gray.700';
          const iconColor = isHighlight ? iconColorTotal : 'gray.400';

          return (
            <Flex
              key={label}
              align='center'
              justify='space-between'
              py={isHighlight ? 4 : 3}
              px={2}
              borderRadius={isHighlight ? 'md' : 'none'}
              bg={rowBg}
              fontWeight={isHighlight ? 'bold' : 'medium'}
              color={rowColor}>
              <Flex align='center' gap={2}>
                {icon && <Icon as={icon} color={iconColor} boxSize={5} />}
                <Text fontSize={['sm', 'md']}>{label}</Text>
              </Flex>
              <Text fontSize={['sm', 'md']}>{value}</Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
