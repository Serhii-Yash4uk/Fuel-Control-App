import { Text, Flex, Button, Box, Stack, Icon, Badge } from '@chakra-ui/react';

import { LuPenLine, LuTrash2 } from 'react-icons/lu';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { MdSpeed } from 'react-icons/md';
import { FaRegMoneyBillAlt } from 'react-icons/fa';

import { formatLicensePlateJSX } from '../../utils';

const isMainTank = (tank) => tank.is_main;

export const AdminEntityItem = ({
  entityKey,
  config,
  item,
  usedMovingCards,
  onEdit,
  onDelete,
  onCreateConnected,
  onActivate,
  isAdmin,
  RoleIcons,
  RoleColors,
}) => {
  if (entityKey === 'users') {
    return (
      <Flex
        align='center'
        justify='space-between'
        p={2}
        borderRadius='md'
        _hover={{ bg: 'gray.50' }}>
        <Flex align='center' gap={3} maxW='300px' overflow='hidden'>
          <Icon
            boxSize={
              item.role === 'accountant'
                ? { base: 7, md: 8 }
                : { base: 8, md: 10 }
            }
            as={RoleIcons?.[item.role] || config.icon}
            color={RoleColors?.[item.role] || 'gray.400'}
          />
          <Stack gap='0'>
            <Text fontWeight='bold' textWrap='nowrap'>
              {item.username}
            </Text>
            <Text fontSize='sm' color='gray.500' textWrap='nowrap'>
              Ім'я: {item.displayName}
            </Text>
          </Stack>
        </Flex>
        <Flex gap={2} justify='flex-end' alignItems='center'>
          <Button
            rounded={{ base: 'lg', lg: 'sm' }}
            size='sm'
            variant='outline'
            onClick={() => onEdit(item)}>
            <LuPenLine /> Редагувати
          </Button>
          <Button
            rounded={{ base: 'lg', lg: 'sm' }}
            size='sm'
            colorPalette='red'
            variant='outline'
            disabled={isAdmin && item.id === isAdmin}
            onClick={() => onDelete(item.id)}>
            <LuTrash2 /> Видалити
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (entityKey === 'fuelTanks') {
    if (isMainTank(item)) {
      return (
        <Box p={2}>
          <Flex align='center' justify='space-between' gap='2'>
            <Stack direction='row' align='center' spacing={4}>
              <Icon as={config.icon} boxSize={8} color='blue.500' />
              <Stack spacing={0}>
                <Text fontWeight='bold'>{item.name}</Text>
                <Text fontSize='md' color='gray.500'>
                  Об'єм: {item.capacity} л
                  {item.threshold && (
                    <Badge size='md' ml={2} colorPalette='red'>
                      Поріг попередження:
                      <Text fontWeight='bold' as='span'>
                        {item.threshold}%
                      </Text>
                    </Badge>
                  )}
                </Text>
              </Stack>
            </Stack>
            <Flex
              gap={2}
              direction='column'
              align='flex-end'
              alignItems='stretch'>
              <Button
                variant='outline'
                size='sm'
                rounded='sm'
                textTransform='uppercase'
                fontWeight='bold'
                onClick={() => onCreateConnected(item.id)}
                w='full'>
                Підключити бочку
              </Button>
              <Flex gap={2} justify='space-between'>
                <Button
                  rounded={{ base: 'lg', lg: 'sm' }}
                  size='sm'
                  variant='outline'
                  onClick={() => onEdit(item)}>
                  <LuPenLine />
                  Редагувати
                </Button>
                <Button
                  rounded={{ base: 'lg', lg: 'sm' }}
                  size='sm'
                  colorPalette='red'
                  variant='outline'
                  disabled={!item.canDelete}
                  onClick={() => onDelete(item.id)}>
                  <LuTrash2 /> Видалити
                </Button>
              </Flex>
            </Flex>
          </Flex>

          {item.connectedTanks && item.connectedTanks.length > 0 && (
            <Box mt={3} pl={8}>
              <Text fontWeight='semibold' mb={2} color='gray.800'>
                Підключені бочки:
              </Text>
              <Stack spacing={2}>
                {item.connectedTanks.map((tank) => (
                  <Flex
                    key={tank.id}
                    align='center'
                    justify='space-between'
                    p={2}
                    gap='2'
                    borderRadius='md'
                    bg='white'
                    boxShadow='xs'>
                    <Stack direction='row' align='center' spacing={3}>
                      <Icon as={config.icon} boxSize={6} color='gray.400' />
                      <Stack spacing={0}>
                        <Text fontWeight='medium'>{tank.name}</Text>
                        <Text fontSize='md' color='gray.500'>
                          Обʼєм: {tank.capacity} л
                          {tank.movingCard && (
                            <Badge ml='2' colorPalette='blue'>
                              Картка переміщення:
                              <Text fontWeight='bold' as='span'>
                                {tank.movingCard}
                              </Text>
                            </Badge>
                          )}
                        </Text>
                      </Stack>
                    </Stack>
                    <Flex gap={2}>
                      <Button
                        rounded={{ base: 'xl', lg: 'lg' }}
                        size='xs'
                        variant='outline'
                        onClick={() => onEdit(tank)}>
                        <LuPenLine />
                      </Button>
                      <Button
                        rounded={{ base: 'xl', lg: 'lg' }}
                        size='xs'
                        colorPalette='red'
                        variant='outline'
                        disabled={!tank.canDelete}
                        onClick={() => onDelete(tank.id)}>
                        <LuTrash2 />
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      );
    }
    return null;
  }

  if (entityKey === 'cards') {
    return (
      <Flex
        align='center'
        justify='space-between'
        p={2}
        borderRadius='md'
        _hover={{ bg: 'gray.50' }}>
        <Flex align='center' gap={3} maxW='380px'>
          <Icon
            boxSize={{ base: 6, md: 10 }}
            as={item.type === 'SALE' ? FaRegMoneyBillAlt : config.icon}
            color={item.type === 'SALE' ? 'green.500' : 'gray.500'}
          />
          <Stack gap='0'>
            <Text fontWeight='bold' textWrap='wrap'>
              {item.cardName}
            </Text>
          </Stack>
        </Flex>
        <Flex gap={2}>
          <Button
            rounded={{ base: 'lg', lg: 'sm' }}
            size='sm'
            variant='outline'
            onClick={() => onEdit(item)}>
            <LuPenLine /> Редагувати
          </Button>
          <Button
            rounded={{ base: 'lg', lg: 'sm' }}
            size='sm'
            colorPalette='red'
            variant='outline'
            disabled={
              item.type === 'SALE' ||
              usedMovingCards.some((card) => card === item.cardName) ||
              item.id === 1
            }
            onClick={() => onDelete(item.id)}>
            <LuTrash2 /> Видалити
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (entityKey === 'limits') {
    return (
      <Flex
        align='center'
        justify='space-between'
        p={2}
        borderRadius='md'
        _hover={{ bg: 'gray.50' }}
        gap={4}>
        <Flex align='center' gap={3} maxW='300px'>
          <Icon as={MdSpeed} boxSize={{ base: 6, md: 10 }} color='gray.500' />
          <Stack spacing={2} justify='center'>
            <Text
              fontWeight='bold'
              display='flex'
              alignItems='center'
              flexWrap='nowrap'>
              {item.brand_model}
              <Badge
                ml={2}
                px={2}
                py={1}
                bg='white'
                color='black'
                border='2px solid'
                borderColor='gray.400'
                borderRadius='md'
                fontWeight='bold'
                fontFamily='monospace'
                fontSize='md'
                letterSpacing='widest'
                boxShadow='sm'
                minW='fit-content'
                textAlign='center'
                variant='subtle'>
                {formatLicensePlateJSX(item.license_plate)}
              </Badge>
            </Text>
            <Flex justify='flex-start' gap='2' maxW='445px' overflow='hidden'>
              <Text fontSize='md' color='gray.600' fontWeight='semibold'>
                Ліміт:
              </Text>
              <Text fontWeight='medium'>{item.limit_liters} л</Text>
            </Flex>
            {(item.edited_at || item.edited_by || item.created_by) && (
              <>
                {item.created_by && (
                  <Text
                    fontSize='sm'
                    color='gray.600'
                    textWrap='wrap'
                    maxW='270px'>
                    <Text as='span' fontWeight='bold'>
                      Створено:{' '}
                    </Text>
                    <Text as='span' fontWeight='normal'>
                      {item.created_by}
                    </Text>
                  </Text>
                )}
                <Text
                  fontSize='sm'
                  color='gray.600'
                  textWrap='wrap'
                  maxW='270px'>
                  <Text as='span' fontWeight='bold'>
                    Деактивовано:{' '}
                  </Text>
                  <Text as='span' fontWeight='normal'>
                    {item.edited_at}
                    {item.edited_by && `, ${item.edited_by}`}
                  </Text>
                </Text>
              </>
            )}
          </Stack>
        </Flex>
        <Flex gap={2}>
          <Button
            rounded={{ base: 'lg', lg: 'sm' }}
            size='sm'
            colorPalette='green'
            variant='outline'
            onClick={() => onActivate(item.id)}>
            <FaRegCircleCheck />
            Активувати
          </Button>
          <Button
            rounded={{ base: 'lg', lg: 'sm' }}
            size='sm'
            colorPalette='red'
            variant='outline'
            onClick={() => onDelete(item.id)}>
            <LuTrash2 />
            Видалити
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Box p={2}>
      <Flex align='center' gap={3} mb={4}>
        <Icon
          as={config.icon}
          boxSize={{ base: 6, md: 10 }}
          color={config.iconColor || 'blue.500'}
        />
        <Text fontWeight='bold' fontSize='lg'>
          {config.type === 'fuelings' ? 'Заправка' : config.label} за
          <Badge colorPalette='gray' fontSize='md' fontWeight='bold' ml={2}>
            {item.dateTime}
          </Badge>
        </Text>
        {item.paid && (
          <Badge
            colorPalette={item.paid === 'Так' ? 'green' : 'red'}
            fontSize='sm'
            ml={2}>
            {item.paid === 'Так' ? 'Оплачено' : 'Не оплачено'}
          </Badge>
        )}
      </Flex>
      <Flex justify='space-between'>
        <Stack spacing={2}>
          {config.fields.map((field, idx) => (
            <Flex
              key={idx}
              justify='flex-start'
              gap='2'
              maxW='445px'
              overflow='hidden'>
              <Text color='gray.600' fontWeight='semibold'>
                {field.label}:
              </Text>
              <Text fontWeight='medium'>{field.value(item)}</Text>
            </Flex>
          ))}
          {(item.edited_at || item.edited_by || item.created_by) && (
            <>
              {item.created_by && (
                <Text fontSize='sm' color='gray.500' textWrap='wrap'>
                  <Text as='span' fontWeight='bold'>
                    Створено:{' '}
                  </Text>
                  <Text as='span' fontWeight='normal'>
                    {item.created_by}
                  </Text>
                </Text>
              )}
              <Text fontSize='sm' color='gray.500' textWrap='wrap'>
                <Text as='span' fontWeight='bold'>
                  Деактивовано:{' '}
                </Text>
                <Text as='span' fontWeight='normal'>
                  {item.edited_at}
                  {item.edited_by && `, ${item.edited_by}`}
                </Text>
              </Text>
            </>
          )}
        </Stack>
        <Flex gap={3} flexDirection='column' justify='flex-end'>
          {config.actions.includes('activate') && (
            <Button
              rounded={{ base: 'lg', lg: 'sm' }}
              size='sm'
              colorPalette='green'
              variant='outline'
              onClick={() => onActivate(item.id)}>
              <FaRegCircleCheck /> Активувати
            </Button>
          )}
          {config.actions.includes('delete') && (
            <Button
              rounded={{ base: 'lg', lg: 'sm' }}
              size='sm'
              colorPalette='red'
              variant='outline'
              onClick={() => onDelete(item.id)}>
              <LuTrash2 /> Видалити
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
