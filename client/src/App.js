import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Container } from '@chakra-ui/react';

import {
  selectIsLoggedIn,
  getUsersInfoAsync,
  selectLogout,
  selectUser,
  logout,
} from './redux';

import { Header, LoginDialog, MainFuelTankRoute } from './components';

import {
  HomePage,
  AdminPanelPage,
  FuelTankPage,
  FuelingsPage,
  CarLimitsPage,
  AccountingReportPage,
} from './pages';

import { hasRole, ProtectedHomeRoute } from './utils';

export const App = () => {
  const dispatch = useDispatch();

  const shouldForceLogout = useSelector(selectLogout);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const role = user?.role;

  const isAdmin = hasRole(role, ['admin']);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUsersInfoAsync());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (shouldForceLogout) {
      dispatch(logout());
    }
  }, [dispatch, shouldForceLogout]);

  return (
    <Box minH='100vh' color='gray.800'>
      {isLoggedIn && (
        <BrowserRouter>
          <Box overflowX='clip'>
            <Header />
            <Container
              maxW='container.xl'
              px={{ base: 4, md: 8, lg: 12 }}
              py={{ base: 4, md: 8 }}>
              <Routes>
                <Route
                  path='/'
                  element={
                    <ProtectedHomeRoute role={role}>
                      <HomePage />
                    </ProtectedHomeRoute>
                  }
                />
                <Route
                  path='/admin-panel'
                  element={isAdmin && <AdminPanelPage />}
                />
                <Route
                  path='/fuel-tank/:id?'
                  element={
                    <MainFuelTankRoute>
                      <FuelTankPage />
                    </MainFuelTankRoute>
                  }
                />
                <Route path='/fuelings' element={<FuelingsPage />} />
                <Route
                  path='/accounting-report'
                  element={<AccountingReportPage />}
                />
                <Route path='/car-limits' element={<CarLimitsPage />} />
              </Routes>
            </Container>
          </Box>
        </BrowserRouter>
      )}

      {!isLoggedIn && <LoginDialog />}
    </Box>
  );
};
