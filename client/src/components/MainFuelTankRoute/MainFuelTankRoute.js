import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectAllFuelTanks,
  selectFuelTanksLoaded,
  selectFuelTanksErrorMessage,
} from '../../redux';

import { ErrorAlert } from '../common';

import { resolveMainTankRedirect, getMainTanks } from '../../utils';

const NO_MAIN_TANKS = 'Головну бочку не знайдено.';

export const MainFuelTankRoute = ({ children }) => {
  const { id } = useParams();

  const tanks = useSelector(selectAllFuelTanks);
  const isLoaded = useSelector(selectFuelTanksLoaded);
  const error = useSelector(selectFuelTanksErrorMessage);

  if (!isLoaded) return null;

  const redirectId = resolveMainTankRedirect(tanks, id);

  if (redirectId) {
    return <Navigate to={`/fuel-tank/${redirectId}`} replace />;
  }

  if (!getMainTanks(tanks).length) {
    return <ErrorAlert title={error || NO_MAIN_TANKS} />;
  }

  return children;
};
