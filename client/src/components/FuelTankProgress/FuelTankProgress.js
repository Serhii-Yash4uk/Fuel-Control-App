import { Box, HStack, Progress } from '@chakra-ui/react';

import { CONSTANTS } from './CONSTANTS';

export const FuelTankProgress = ({
  fillPercentage = 50,
  progressTrackSize = 5,
  warningThreshold = 30,
}) => {
  const safeRemains = Math.max(0, Math.min(fillPercentage, 100));

  let colorPalette = 'gray';

  if (typeof warningThreshold === 'number') {
    colorPalette = safeRemains <= warningThreshold ? 'red' : 'gray';
  }

  return (
    <Box py={6}>
      <Progress.Root
        value={safeRemains}
        fontSize='lg'
        max={100}
        colorPalette={colorPalette}>
        <HStack gap={2} w='100%'>
          <Progress.Label>{CONSTANTS.Remains}</Progress.Label>
          <Progress.Track flex='1' h={progressTrackSize}>
            <Progress.Range />
          </Progress.Track>
          <Progress.ValueText fontSize='lg'>
            {fillPercentage.toFixed(2) + '%'}
          </Progress.ValueText>
        </HStack>
      </Progress.Root>
    </Box>
  );
};
