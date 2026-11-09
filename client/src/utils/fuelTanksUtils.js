export const parseConnectedTankIds = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const ids = JSON.parse(value);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return String(value).split(',').map(Number).filter(Boolean);
  }
};

export const getMainTanks = (tanks = []) =>
  tanks.filter(({ is_main }) => is_main);

export const resolveMainTankRedirect = (tanks, requestedId) => {
  const mainTanks = getMainTanks(tanks);
  const id = String(requestedId);

  if (!mainTanks.length || mainTanks.some((tank) => String(tank.id) === id)) {
    return null;
  }

  const parentTank = mainTanks.find((tank) =>
    parseConnectedTankIds(tank.connected_tank_ids).some(
      (connectedId) => String(connectedId) === id
    )
  );

  return String((parentTank || mainTanks[0]).id);
};
