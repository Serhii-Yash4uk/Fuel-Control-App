export const parseConnectedTankIds = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const ids = JSON.parse(value);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return String(value)
      .split(',')
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0);
  }
};

export const isMainTank = async (connection, id) => {
  const [rows] = await connection.query(
    'SELECT is_main FROM fuel_tanks WHERE id = ?',
    [id],
  );
  return !!rows[0]?.is_main;
};
