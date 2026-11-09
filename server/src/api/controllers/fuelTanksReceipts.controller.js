import dbTunnel from '../../config/database.js';
import { isMainTank } from '../../helpers/fuelTanks.helper.js';

const TANK_NOT_FOUND = 'Бочку не знайдено';
const INVALID_LITERS = 'Кількість літрів повинна бути більше 0';

const toNullable = (value) =>
  value === '' || value === undefined ? null : value;

const toPrice = (value) => (Number(value) > 0 ? value : null);

const getFuelTanksReceipts = async (req, res) => {
  try {
    const { tank_id } = req.params;

    if (!tank_id) {
      return res.status(400).json({ error: 'Ідентифікатор бочки не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    if (!(await isMainTank(connection, tank_id))) {
      return res.status(404).json({ error: TANK_NOT_FOUND });
    }

    const [rows] = await connection.query(
      `SELECT 
        r.id,
        r.tank_id,
        r.liters,
        r.price_per_liter,
        r.payment_method,
        r.paid,
        r.note,
        r.is_active,
        r.\`timestamp\`,
        r.edited_at,
        u.displayName AS edited_by,
        cu.displayName AS created_by
      FROM fuel_tanks_receipts r
      LEFT JOIN users u ON u.id = r.edited_by
      LEFT JOIN users cu ON cu.id = r.created_by
      WHERE r.tank_id = ?
      ORDER BY r.\`timestamp\` DESC`,
      [tank_id],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const getDeactivatedFuelTanksReceipts = async (req, res) => {
  try {
    const connection = await dbTunnel.getConnection();
    const [rows] = await connection.query(
      `SELECT 
        r.id,
        r.liters,
        r.price_per_liter,
        r.payment_method,
        r.paid,
        r.note,
        r.is_active,
        r.\`timestamp\`,
        r.edited_at,
        u.displayName AS edited_by,
        cu.displayName AS created_by,
        ft.name AS azs_name
      FROM fuel_tanks_receipts r
      LEFT JOIN users u ON u.id = r.edited_by
      LEFT JOIN users cu ON cu.id = r.created_by
      LEFT JOIN fuel_tanks ft ON r.tank_id = ft.id
      WHERE r.is_active = 0
      ORDER BY r.\`timestamp\` DESC`,
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const addFuelTankReceipt = async (req, res) => {
  try {
    const {
      tank_id,
      liters,
      price = null,
      payment_method = null,
      paid = null,
      note = null,
      currentBalance,
      averagePrice,
    } = req.body;

    if (!tank_id) {
      return res.status(400).json({ error: 'Ідентифікатор бочки не вказано' });
    }

    if (!(Number(liters) > 0)) {
      return res.status(400).json({ error: INVALID_LITERS });
    }

    const connection = await dbTunnel.getConnection();

    if (!(await isMainTank(connection, tank_id))) {
      return res.status(404).json({ error: TANK_NOT_FOUND });
    }

    const [result] = await connection.query(
      `INSERT INTO fuel_tanks_receipts 
        (tank_id, created_at, liters, price_per_liter, payment_method, paid, note, \`timestamp\`, created_by, last_liters_balance, last_average_price)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, UNIX_TIMESTAMP(NOW()), ?, ?, ?)`,
      [
        tank_id,
        liters,
        toPrice(price),
        toNullable(payment_method),
        toNullable(paid),
        toNullable(note),
        req.user.id,
        toNullable(currentBalance),
        toNullable(averagePrice),
      ],
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Запис успішно створено',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const deleteFuelTankReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор запису не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query(
      'DELETE FROM fuel_tanks_receipts WHERE id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Запис не знайдено' });
    }

    res.status(200).json({ message: 'Запис успішно видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const updateFuelTankReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { liters, price, paymentMethod, paid, note } = req.body;
    const editedBy = req.user.id;
    const paidValue = paid === 'Так' ? 1 : 0;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор запису не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [currentRows] = await connection.query(
      `SELECT id, tank_id, timestamp
       FROM fuel_tanks_receipts
       WHERE id = ?`,
      [id],
    );

    if (!currentRows.length) {
      return res.status(404).json({ error: 'Запис не знайдено' });
    }

    const currentReceipt = currentRows[0];

    const [previousRows] = await connection.query(
      `SELECT id, price_per_liter
       FROM fuel_tanks_receipts
       WHERE tank_id = ?
         AND timestamp < ?
         AND is_active = 1
       ORDER BY timestamp DESC
       LIMIT 1`,
      [currentReceipt.tank_id, currentReceipt.timestamp],
    );

    if (previousRows.length && !Number(previousRows[0].price_per_liter)) {
      return res.status(400).json({
        error: 'Спочатку встановіть ціну для попереднього поповнення.',
      });
    }

    const [result] = await connection.query(
      `UPDATE fuel_tanks_receipts 
       SET liters = ?, 
           price_per_liter = ?, 
           payment_method = ?, 
           paid = ?, 
           note = ?, 
           edited_at = UNIX_TIMESTAMP(NOW()), 
           edited_by = ?
       WHERE id = ?`,
      [
        liters,
        toPrice(price),
        toNullable(paymentMethod),
        paidValue,
        toNullable(note),
        editedBy,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Запис не знайдено' });
    }

    res.status(200).json({ message: 'Запис успішно оновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const updateReceiptActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const editedBy = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор запису не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [rows] = await connection.query(
      'SELECT is_active FROM fuel_tanks_receipts WHERE id = ?',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Запис не знайдено' });
    }

    const currentStatus = rows[0].is_active;
    const newStatus = currentStatus ? 0 : 1;

    const [result] = await connection.query(
      `UPDATE fuel_tanks_receipts 
       SET is_active = ?, edited_by = ?, edited_at = UNIX_TIMESTAMP(NOW())
       WHERE id = ?`,
      [newStatus, editedBy, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Запис не знайдено' });
    }

    res.status(200).json({
      message: newStatus
        ? 'Запис успішно активовано'
        : 'Запис успішно деактивовано',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export {
  getFuelTanksReceipts,
  getDeactivatedFuelTanksReceipts,
  addFuelTankReceipt,
  deleteFuelTankReceipt,
  updateFuelTankReceipt,
  updateReceiptActiveStatus,
};
