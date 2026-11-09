import {
  Box,
  Flex,
  EmptyState,
  Heading,
  Button,
  Stack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { LuFuel } from 'react-icons/lu';

import { AdminEntityItem } from '..';
import { ErrorAlert } from '../../components';

import { CONSTANTS } from '../../pages';

export const AdminEntityList = ({
  entityKey,
  config,
  items,
  usedMovingCards,
  divideY,
  onCreate,
  onCreateConnected,
  onEdit,
  onDelete,
  onActivate,
  isAdmin,
  RoleIcons,
  RoleColors,
  error,
}) => (
  <Box p={{ base: 4, md: 6 }} m='1' bg='white' borderRadius='lg' boxShadow='md'>
    <Flex justify='space-between' align='center' mb={6} gap='4' flexWrap='wrap'>
      <Heading size='lg' fontWeight='bold'>
        {config.headingText}
      </Heading>

      {onCreate && !error && (
        <Button size='md' onClick={onCreate}>
          {CONSTANTS.entityCreateButtonTypes[entityKey] || 'Створити'}
        </Button>
      )}
    </Flex>

    {error && <ErrorAlert title={error} />}

    {items.length > 0 && (
      <Stack gap={2} divideY={divideY}>
        {items.map((item) => (
          <AdminEntityItem
            key={item.id}
            entityKey={entityKey}
            config={config}
            item={item}
            usedMovingCards={usedMovingCards}
            onCreateConnected={onCreateConnected}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            isAdmin={isAdmin}
            RoleIcons={RoleIcons}
            RoleColors={RoleColors}
          />
        ))}
      </Stack>
    )}

    {items.length === 0 && (
      <EmptyState.Root>
        <EmptyState.Content gap={2}>
          <EmptyState.Indicator>
            <Icon as={config.icon || LuFuel} boxSize={16} />
          </EmptyState.Indicator>
          <VStack textAlign='center'>
            <EmptyState.Title fontSize='xl' color='gray.600' maxW='330px'>
              {config.emptyTitle || 'Немає даних для відображення.'}
            </EmptyState.Title>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )}
  </Box>
);
