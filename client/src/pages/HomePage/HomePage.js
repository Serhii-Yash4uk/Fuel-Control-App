import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Heading,
  Flex,
  Button,
  EmptyState,
  Icon,
  VStack,
  createListCollection,
} from '@chakra-ui/react';
import { LuFuel } from 'react-icons/lu';

import {
  fetchFuelings,
  updateFuelingAsync,
  selectSaleFuelings,
  selectFuelingsLoadingStatus,
  selectFuelingsErrorMessage,
  selectUser,
  selectUsersErrorMessage,
  selectInitializedUser,
  fetchCardsAsync,
  selectCards,
} from '../../redux';

import {
  SaleFuelingCard,
  SaleFuelingCardSkeleton,
  ErrorAlert,
  Toaster,
} from '../../components';

import { hasRole } from '../../utils';

import { CONSTANTS } from './CONSTANTS';

export const HomePage = () => {
  const dispatch = useDispatch();

  const saleFuelings = useSelector(selectSaleFuelings);
  const cards = useSelector(selectCards);
  const isLoading = useSelector(selectFuelingsLoadingStatus);
  const error = useSelector(selectFuelingsErrorMessage);

  const user = useSelector(selectUser);
  const role = user?.role;
  const userError = useSelector(selectUsersErrorMessage);
  const initializedUser = useSelector(selectInitializedUser);

  useEffect(() => {
    dispatch(fetchFuelings());
    dispatch(fetchCardsAsync());
  }, [dispatch]);

  const handleSave = (fueling) => {
    dispatch(
      updateFuelingAsync({
        id: fueling.id,
        changes: {
          amount_uah: fueling.amount_uah,
          comment: fueling.comment,
          driver: fueling.driver,
        },
      })
    );
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const containsAnyRole = hasRole(role, ['accountant', 'admin', 'fueler']);

  const cardsCollection = createListCollection({
    items: (Array.isArray(cards) ? cards : []).map(({ id, cardName }) => ({
      value: id,
      label: cardName,
    })),
  });

  if (initializedUser && !containsAnyRole)
    return (
      <ErrorAlert
        title={userError}
        position='fixed'
        w={{ base: '90%', sm: '70%', md: '50%' }}
        top={{ base: '160px', md: '120px' }}
        left='50%'
        transform='translateX(-50%)'
      />
    );

  return (
    <Flex direction='column' gap={4} alignItems='center'>
      <Heading
        size={['5xl', '6xl']}
        letterSpacing={['1px', '1.5px', '2px', '2px']}
        textAlign='center'
        mb={[8, 12, 16, 16]}>
        {CONSTANTS.Refuel}
      </Heading>

      <Button
        size='xl'
        textTransform='uppercase'
        fontWeight='bold'
        border='1px solid'
        borderColor='gray.400'
        boxShadow='md'
        mb={2}
        _hover={{ bg: 'gray.100', color: 'gray.900' }}
        onClick={handleRefreshPage}>
        {CONSTANTS.RefreshPage}
      </Button>

      {isLoading && <SaleFuelingCardSkeleton />}
      {error && <ErrorAlert title={error} />}

      {!isLoading && saleFuelings.length === 0 && (
        <EmptyState.Root>
          <EmptyState.Content gap={2}>
            <EmptyState.Indicator>
              <Icon as={LuFuel} boxSize={16} />
            </EmptyState.Indicator>
            <VStack textAlign='center'>
              <EmptyState.Title fontSize='xl' color='gray.600' maxW='330px'>
                {CONSTANTS.NoSalesOrRefuelingWithoutCards}
              </EmptyState.Title>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      )}

      {!isLoading && !error && (
        <Flex direction='column' gap={4} minW='100%'>
          {saleFuelings.map((fueling) => (
            <SaleFuelingCard
              key={fueling.id}
              fueling={fueling}
              onSave={handleSave}
              cardsCollection={cardsCollection}
            />
          ))}
        </Flex>
      )}

      <Toaster />
    </Flex>
  );
};
