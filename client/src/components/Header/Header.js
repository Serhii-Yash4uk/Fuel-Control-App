import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useMatch, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectUser,
  logout,
  selectInitializedUser,
  fetchAllFuelTanks,
  selectAllFuelTanks,
} from '../../redux';

import {
  Box,
  Container,
  Flex,
  Portal,
  CloseButton,
  HStack,
  Text,
  Button,
  VStack,
  Icon,
  Drawer,
  useBreakpointValue,
  createListCollection,
} from '@chakra-ui/react';

import { FaBars } from 'react-icons/fa';
import { LuArrowRightToLine } from 'react-icons/lu';
import { MdLocalGasStation } from 'react-icons/md';

import { NavLink, FuelTankSelect } from '..';

import { getDynamicPath, getVisibleNavLinks, getMainTanks } from '../../utils';

import { CONSTANTS } from './CONSTANTS';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tankMatch = useMatch('/fuel-tank/:id');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const allTanks = useSelector(selectAllFuelTanks);

  const user = useSelector(selectUser);
  const role = user?.role;
  const initializedUser = useSelector(selectInitializedUser);

  const selectedTankId = tankMatch?.params.id;
  const value = useMemo(
    () => (selectedTankId ? [selectedTankId] : []),
    [selectedTankId]
  );

  const dynamicPath = useMemo(
    () => (initializedUser ? getDynamicPath(role) : '/'),
    [initializedUser, role]
  );

  const navLinks = useMemo(
    () => (initializedUser ? getVisibleNavLinks(role, CONSTANTS.NAVLINKS) : []),
    [initializedUser, role]
  );

  const allMainTanks = useMemo(() => getMainTanks(allTanks), [allTanks]);

  const tanksCollection = useMemo(
    () =>
      createListCollection({
        items: allMainTanks.map(({ id, name }) => ({
          value: String(id),
          label: name,
        })),
      }),
    [allMainTanks]
  );

  const showHamburger = useBreakpointValue(
    navLinks.length > 4 ? { base: true, xl: false } : { base: true, lg: false }
  );

  useEffect(() => {
    dispatch(fetchAllFuelTanks());
  }, [dispatch]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChange = (selectedOption) => {
    const selectedId = Array.isArray(selectedOption.value)
      ? selectedOption.value[0]
      : selectedOption.value;

    navigate(`/fuel-tank/${selectedId}`);
  };

  const renderNavWithTankSelect = (isMobile = false) => (
    <>
      {role === 'accountant' && allMainTanks.length > 1 && (
        <FuelTankSelect
          tanksCollection={tanksCollection}
          value={value}
          handleChange={handleChange}
          hidePortal={isMobile}
          maxW={isMobile ? undefined : '180px'}
          minW={isMobile ? undefined : '120px'}
          size={isMobile ? 'sm' : 'md'}
        />
      )}

      {navLinks.map(({ path, name }, _) => {
        if (name === 'Заправка') {
          return (
            <React.Fragment key={name}>
              <NavLink
                to={path}
                fontSize={isMobile ? 'lg' : undefined}
                p={isMobile ? 2 : undefined}
                w={isMobile ? '100%' : undefined}>
                {name}
              </NavLink>

              {role !== 'accountant' && allMainTanks.length > 1 && (
                <FuelTankSelect
                  tanksCollection={tanksCollection}
                  value={value}
                  handleChange={handleChange}
                  hidePortal={isMobile}
                  maxW={isMobile ? undefined : '180px'}
                  minW={isMobile ? undefined : '120px'}
                  size={isMobile ? 'sm' : 'xs'}
                />
              )}
            </React.Fragment>
          );
        }

        if (name === 'Бочка') {
          if (allMainTanks.length <= 1) {
            return (
              <NavLink
                to={path}
                key={name}
                fontSize={isMobile ? 'lg' : undefined}
                p={isMobile ? 2 : undefined}
                w={isMobile ? '100%' : undefined}>
                {name}
              </NavLink>
            );
          }
          return null;
        }

        return (
          <NavLink
            to={path}
            key={name}
            fontSize={isMobile ? 'lg' : undefined}
            p={isMobile ? 2 : undefined}
            w={isMobile ? '100%' : undefined}>
            {name}
          </NavLink>
        );
      })}
    </>
  );

  return (
    <Box bg='gray.800' w='full' position='sticky' top={0} zIndex='100'>
      <Container
        px={{ base: 4, md: 8, lg: 10, xl: 12 }}
        py={4}
        maxW='container.xl'>
        <Flex
          h='full'
          alignItems='center'
          justifyContent='space-between'
          gap='2'>
          <Flex
            gap='2'
            as='button'
            alignItems='center'
            cursor='pointer'
            onClick={() => navigate(dynamicPath)}
            transition='opacity 0.2s'
            _hover={{ opacity: 0.8 }}>
            <Icon as={MdLocalGasStation} boxSize='10' color='teal.300' />
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight='bold'
              color='white'
              textTransform='uppercase'>
              {CONSTANTS.FuelAccounting}
            </Text>
          </Flex>

          <Flex flex='1' justify='center'>
            {!showHamburger && (
              <HStack as='nav' gap='3' whiteSpace='nowrap'>
                {renderNavWithTankSelect(false)}
              </HStack>
            )}
          </Flex>

          <Flex alignItems='center' gap={2}>
            {showHamburger && (
              <Drawer.Root
                open={isDrawerOpen}
                onOpenChange={({ open }) => setIsDrawerOpen(open)}
                restoreFocus={false}
                placement='start'
                size='full'
                justifyContent='center'
                alignItems='center'>
                <Drawer.Trigger asChild>
                  <Button
                    variant='ghost'
                    color='white'
                    fontSize='2xl'
                    borderColor='gray.400'
                    rounded='lg'
                    _hover={CONSTANTS.ButtonHover}>
                    <Icon as={FaBars} boxSize={6} />
                  </Button>
                </Drawer.Trigger>
                <Portal>
                  <Drawer.Backdrop />
                  <Drawer.Positioner>
                    <Drawer.Content
                      bg='gray.800'
                      color='white'
                      minW='60vw'
                      maxW='80vw'>
                      <Flex justify='flex-end' p={4}>
                        <Drawer.CloseTrigger asChild>
                          <CloseButton
                            size='lg'
                            color='white'
                            _hover={CONSTANTS.ButtonHover}
                          />
                        </Drawer.CloseTrigger>
                      </Flex>
                      <Drawer.Body>
                        <VStack mt={8} gap={4}>
                          {renderNavWithTankSelect(true)}
                        </VStack>
                      </Drawer.Body>
                    </Drawer.Content>
                  </Drawer.Positioner>
                </Portal>
              </Drawer.Root>
            )}

            <Button
              variant='ghost'
              rounded='lg'
              color='white'
              fontWeight='bold'
              borderColor='gray.400'
              _hover={CONSTANTS.ButtonHover}
              onClick={handleLogout}
              alignSelf='flex-end'>
              {CONSTANTS.Exit}
              <Icon as={LuArrowRightToLine} />
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
