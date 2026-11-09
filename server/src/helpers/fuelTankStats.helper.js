const MAIN_TANK_ADMIN_CARD = '1 Admin card';

const computeTankStats = ({
  tankInfo,
  totalReceiptsLiters,
  fuelings,
  connectedTankIds = [],
  adminCardValue = MAIN_TANK_ADMIN_CARD,
}) => {
  const tankId = tankInfo.id;
  const additionalLiters = Number(tankInfo.additionalLitersForSync) || 0;

  let transferIn = 0;
  let transferOut = 0;
  let used = 0;

  fuelings.forEach(({ azs_id, driver, liters }) => {
    const fuelLiters = Number(liters) || 0;

    if (driver !== adminCardValue && azs_id === tankId) {
      used += fuelLiters;
      return;
    }

    if (driver === adminCardValue) {
      if (azs_id === tankId) {
        transferOut += fuelLiters;
      }

      if (azs_id !== tankId && connectedTankIds.includes(azs_id)) {
        transferIn += fuelLiters;
      }
    }
  });

  const totalFuelingsLiters = transferOut + used - transferIn;

  const currentBalance =
    (Number(totalReceiptsLiters) || 0) - totalFuelingsLiters + additionalLiters;

  const fillPercentage =
    tankInfo.capacity > 0 ? (currentBalance / tankInfo.capacity) * 100 : 0;

  return {
    id: tankId,
    tankName: tankInfo.name,
    tankCapacity: Number(tankInfo.capacity),
    currentBalance: Number(currentBalance),
    fillPercentage: Number(fillPercentage.toFixed(2)),
    warningThreshold: Number(tankInfo.threshold),
  };
};

export const calculateTankStats = async (
  connection,
  tankInfo,
  { connectedTankIds = [], adminCardValue = MAIN_TANK_ADMIN_CARD } = {},
) => {
  let receiptsWhere = 'tank_id = ? AND is_active = 1';
  const receiptsParams = [tankInfo.id];

  if (tankInfo.startTimestampReceipts) {
    receiptsWhere += ' AND `timestamp` > ?';
    receiptsParams.push(tankInfo.startTimestampReceipts);
  }

  const azsIds = [tankInfo.id, ...connectedTankIds];
  let fuelingsWhere = `azs_id IN (${azsIds.map(() => '?').join(',')}) AND is_active = 1`;
  const fuelingsParams = [...azsIds];

  if (tankInfo.startTimestampFuelings) {
    fuelingsWhere += ' AND event_timestamp > ?';
    fuelingsParams.push(tankInfo.startTimestampFuelings);
  }

  const [[receiptRows], [fuelings]] = await Promise.all([
    connection.query(
      `SELECT SUM(liters) AS totalReceiptsLiters
       FROM fuel_tanks_receipts
       WHERE ${receiptsWhere}`,
      receiptsParams,
    ),
    connection.query(
      `SELECT liters, azs_id, COALESCE(driver_ui, driver) AS driver
       FROM fuel_events
       WHERE ${fuelingsWhere}`,
      fuelingsParams,
    ),
  ]);

  return computeTankStats({
    tankInfo,
    totalReceiptsLiters: receiptRows[0]?.totalReceiptsLiters,
    fuelings,
    connectedTankIds,
    adminCardValue,
  });
};

export const calculateAveragePrice = (lastPricedReceipt) => {
  if (!lastPricedReceipt) return 0;

  const liters = Number(lastPricedReceipt.liters) || 0;
  const pricePerLiter = Number(lastPricedReceipt.price_per_liter) || 0;
  const lastLitersBalance = Number(lastPricedReceipt.last_liters_balance) || 0;
  const lastAveragePrice = Number(lastPricedReceipt.last_average_price) || 0;
  const totalLiters = liters + lastLitersBalance;

  if (totalLiters <= 0) return pricePerLiter;

  return (
    (liters * pricePerLiter + lastLitersBalance * lastAveragePrice) /
    totalLiters
  );
};
