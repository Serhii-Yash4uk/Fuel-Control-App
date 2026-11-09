import axios from 'axios';
import { API } from './constants';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.logout && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = async () => {
  try {
    const response = await axios.get(API.BASE_URL + '/users');
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const getUsersInfo = async () => {
  try {
    if (!localStorage.getItem('token')) return null;

    const response = await axios.get(API.BASE_URL + '/users/me');
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    const logout = err.response?.data?.logout;
    const customError = new Error(error || err.message);

    if (logout) customError.logout = logout;
    throw customError;
  }
};

export const createUser = async (payload) => {
  try {
    const response = await axios.post(API.BASE_URL + '/users/create', payload);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};
export const updateUser = async ({ id, changes }) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + '/users/update/' + id,
      changes,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(API.BASE_URL + '/users/delete/' + id);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const loginUser = async ({ username, password }) => {
  try {
    const response = await axios.post(API.BASE_URL + '/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const getAllFuelTanks = async () => {
  try {
    const response = await axios.get(API.BASE_URL + API.FUEL_TANKS);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const getAllFuelTanksWithConnected = async () => {
  try {
    const response = await axios.get(
      API.BASE_URL + API.FUEL_TANKS_WITH_CONNECTED,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const createMainFuelTank = async (payload) => {
  try {
    const response = await axios.post(API.BASE_URL + API.MAIN_TANKS, payload);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const updateFuelTank = async ({ id, changes }) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + API.FUEL_TANKS + `/${id}`,
      changes,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const createConnectedFuelTank = async (payload) => {
  try {
    const response = await axios.post(
      API.BASE_URL + API.CONNECTED_TANKS,
      payload,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const deleteFuelTank = async (id) => {
  try {
    const response = await axios.delete(
      API.BASE_URL + API.FUEL_TANKS + `/${id}`,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const getFuelTankStats = async (tankId = 1) => {
  try {
    const response = await axios.get(
      API.BASE_URL + API.FUEL_TANKS + `/${tankId}` + API.STATS,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const getFuelTanksReceipts = async (tankId = 1) => {
  try {
    const response = await axios.get(
      `${API.BASE_URL + API.RECEIPTS}/${tankId}`,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const getAllDeactivatedFuelTanksReceipts = async () => {
  try {
    const response = await axios.get(
      `${API.BASE_URL + API.DEACTIVATED_RECEIPTS}`,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const createFuelTanksReceipts = async (payload) => {
  try {
    const response = await axios.post(API.BASE_URL + API.RECEIPTS, payload);

    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    throw new Error(errorMessage);
  }
};

export const updateFuelTanksReceipts = async ({ id, changes }) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + API.RECEIPTS + `/${id}`,
      changes,
    );

    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    throw new Error(errorMessage);
  }
};

export const deactivateFuelTanksReceipts = async (id) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + API.RECEIPTS + `/${id}/updateActiveStatus`,
    );

    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    throw new Error(errorMessage);
  }
};

export const deleteFuelTanksReceipts = async (id) => {
  try {
    const response = await axios.delete(API.BASE_URL + API.RECEIPTS + `/${id}`);

    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    throw new Error(errorMessage);
  }
};

export const getFuelings = async (startDate, endDate) => {
  try {
    const response = await axios.get(API.BASE_URL + API.FUELINGS, {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const updateFueling = async ({ id, changes }) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + API.FUELINGS + `/${id}`,
      changes,
    );

    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const deactivateFueling = async (id) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + API.FUELINGS + `/${id}/updateActiveStatus`,
    );
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    throw new Error(errorMessage);
  }
};

export const deleteFueling = async (id) => {
  try {
    const response = await axios.delete(API.BASE_URL + API.FUELINGS + `/${id}`);
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    throw new Error(errorMessage);
  }
};

export const getCards = async () => {
  try {
    const response = await axios.get(API.BASE_URL + API.CARDS);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const createCard = async (payload) => {
  try {
    const response = await axios.post(API.BASE_URL + API.CARDS, payload);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const updateCard = async ({ id, changes }) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + API.CARDS + `/${id}`,
      changes,
    );

    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const deleteCard = async (id) => {
  try {
    const response = await axios.delete(API.BASE_URL + API.CARDS + `/${id}`);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const getAccountingReport = async (startDate, endDate) => {
  try {
    const response = await axios.get(API.BASE_URL + API.ACCONTING_REPORT, {
      params: { startDate, endDate },
    });

    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const getCarLimits = async (startDate, endDate) => {
  try {
    const response = await axios.get(API.BASE_URL + API.LIMITS, {
      params: { startDate, endDate },
    });

    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const createCarLimit = async (payload) => {
  try {
    const response = await axios.post(API.BASE_URL + API.LIMITS, payload);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};

export const updateCarLimit = async ({ id, changes }) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + API.LIMITS + `/${id}`,
      changes,
    );

    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};
export const deactivateCarLimit = async (id) => {
  try {
    const response = await axios.patch(
      API.BASE_URL + API.LIMITS + `/${id}/updateActiveStatus`,
    );
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};
export const deleteCarLimit = async (id) => {
  try {
    const response = await axios.delete(API.BASE_URL + API.LIMITS + `/${id}`);
    return response.data;
  } catch (err) {
    const error = err.response?.data?.error;
    throw new Error(error || err.message);
  }
};
