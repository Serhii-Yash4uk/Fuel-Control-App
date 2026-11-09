import dbTunnel from '../../config/database.js';

import {
  calculateTankStats,
  calculateAveragePrice,
} from '../../helpers/fuelTankStats.helper.js';
import { parseConnectedTankIds } from '../../helpers/fuelTanks.helper.js';

const getAllFuelTanks = async (_, res) => {
  try {
    const connection = await dbTunnel.getConnection();
    const [rows] = await connection.query('SELECT * FROM fuel_tanks');

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const getAllFuelTanksWithConnected = async (_, res) => {
  try {
    const connection = await dbTunnel.getConnection();

    const [[rows], [usedTankRows]] = await Promise.all([
      connection.query('SELECT * FROM fuel_tanks'),
      connection.query(
        'SELECT DISTINCT azs_id FROM fuel_events WHERE azs_id IS NOT NULL',
      ),
    ]);

    const tanksWithFuelings = new Set(usedTankRows.map(({ azs_id }) => azs_id));

    const tanksById = {};
    rows.forEach((tank) => {
      tanksById[tank.id] = {
        ...tank,
        connectedTanks: [],
        canDelete: !tanksWithFuelings.has(tank.id),
      };
    });

    const mainTanks = rows
      .filter((tank) => tank.is_main)
      .map((tank) => {
        const mainTank = tanksById[tank.id];
        mainTank.connectedTanks = parseConnectedTankIds(
          tank.connected_tank_ids,
        )
          .map((id) => tanksById[id])
          .filter(Boolean);
        return mainTank;
      });

    res.json(mainTanks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const createMainTank = async (req, res) => {
  try {
    const {
      name,
      capacity,
      threshold,
      startTimestampReceipts,
      startTimestampFuelings,
      additionalLitersForSync,
    } = req.body;

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query(
      `INSERT INTO fuel_tanks 
        (name, capacity, threshold, edited_at, edited_by, connected_tank_ids, startTimestampReceipts, startTimestampFuelings, additionalLitersForSync, movingCard, is_main)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        capacity,
        threshold || null,
        null,
        null,
        JSON.stringify([]),
        startTimestampReceipts || null,
        startTimestampFuelings || null,
        additionalLitersForSync || null,
        null,
        1,
      ],
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Головну бочку успішно створено',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const createConnectedTank = async (req, res) => {
  try {
    const {
      name,
      capacity,
      threshold,
      movingCard,
      mainTankId,
      startTimestampReceipts,
      startTimestampFuelings,
      additionalLitersForSync,
    } = req.body;

    if (!mainTankId) {
      return res
        .status(400)
        .json({ error: 'Ідентифікатор головної бочки не вказано' });
    }
    if (!movingCard) {
      return res.status(400).json({ error: 'Картка переміщення не вказана' });
    }

    const pool = await dbTunnel.getConnection();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [mainRows] = await connection.query(
        `SELECT connected_tank_ids FROM fuel_tanks WHERE id = ? FOR UPDATE`,
        [mainTankId],
      );

      if (!mainRows.length) {
        await connection.rollback();
        return res.status(404).json({ error: 'Бочку не знайдено' });
      }

      const [result] = await connection.query(
        `INSERT INTO fuel_tanks 
          (name, capacity, threshold, edited_at, edited_by, connected_tank_ids, startTimestampReceipts, startTimestampFuelings, additionalLitersForSync, movingCard, is_main)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          capacity,
          threshold || null,
          null,
          null,
          null,
          startTimestampReceipts || null,
          startTimestampFuelings || null,
          additionalLitersForSync || null,
          movingCard,
          0,
        ],
      );

      const connectedTankId = result.insertId;

      const connectedIds = [
        ...parseConnectedTankIds(mainRows[0].connected_tank_ids),
        connectedTankId,
      ];

      await connection.query(
        `UPDATE fuel_tanks SET connected_tank_ids = ? WHERE id = ?`,
        [JSON.stringify(connectedIds), mainTankId],
      );

      await connection.commit();

      res.status(201).json({
        id: connectedTankId,
        message: 'Підключену бочку успішно створено',
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const updateFuelTank = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await dbTunnel.getConnection();

    const [rows] = await connection.query(
      `SELECT * FROM fuel_tanks WHERE id = ?`,
      [id],
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Бочку не знайдено' });
    }

    const current = rows[0];

    const name = req.body.name ? req.body.name : current.name;
    const capacity = req.body.capacity ? req.body.capacity : current.capacity;
    const threshold = req.body.threshold
      ? req.body.threshold
      : current.threshold;
    const movingCard = req.body.movingCard
      ? req.body.movingCard
      : current.movingCard;

    let updateQuery = `UPDATE fuel_tanks SET name = ?, capacity = ?, threshold = ?`;
    let updateFields = [name, capacity, threshold];

    if (current.movingCard || req.body.movingCard) {
      updateQuery += `, movingCard = ?`;
      updateFields.push(movingCard);
    }

    updateQuery += ` WHERE id = ?`;
    updateFields.push(id);

    const [result] = await connection.query(updateQuery, updateFields);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Бочку не знайдено' });
    }

    return res.status(200).json({
      id,
      message: 'Бочку успішно оновлено',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const deleteFuelTank = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await dbTunnel.getConnection();

    const [fuelings] = await pool.query(
      `SELECT 1 FROM fuel_events WHERE azs_id = ? LIMIT 1`,
      [id],
    );
    if (fuelings.length) {
      return res
        .status(400)
        .json({ error: 'Неможливо видалити бочку, по якій є заправки' });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [tanks] = await connection.query(
        `SELECT id, connected_tank_ids FROM fuel_tanks WHERE connected_tank_ids IS NOT NULL AND connected_tank_ids != '[]'`,
      );

      for (const tank of tanks) {
        const ids = parseConnectedTankIds(tank.connected_tank_ids);
        const filtered = ids.filter((tankId) => String(tankId) !== String(id));
        if (filtered.length !== ids.length) {
          await connection.query(
            `UPDATE fuel_tanks SET connected_tank_ids = ? WHERE id = ?`,
            [JSON.stringify(filtered), tank.id],
          );
        }
      }

      const [result] = await connection.query(
        `DELETE FROM fuel_tanks WHERE id = ?`,
        [id],
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Бочку не знайдено' });
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    return res.status(200).json({
      id,
      message: 'Бочку успішно видалено',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const getFuelTankStatsWithConnections = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await dbTunnel.getConnection();

    const [mainTankRows] = await connection.query(
      `SELECT
        id,
        name,
        capacity,
        threshold,
        connected_tank_ids,
        startTimestampReceipts,
        startTimestampFuelings,
        additionalLitersForSync,
        movingCard,
        is_main
      FROM fuel_tanks
      WHERE id = ?;`,
      [id],
    );

    if (!mainTankRows.length || !mainTankRows[0].is_main)
      return res.status(404).json({ error: 'Бочку не знайдено' });

    const mainTank = mainTankRows[0];
    const connectedIds = parseConnectedTankIds(mainTank.connected_tank_ids);

    let connectedTanks = [];
    if (connectedIds.length) {
      const [rows] = await connection.query(
        `SELECT 
          id, 
          name, 
          capacity, 
          threshold, 
          connected_tank_ids, 
          startTimestampReceipts, 
          startTimestampFuelings, 
          additionalLitersForSync, 
        movingCard
        FROM fuel_tanks 
        WHERE id IN (${connectedIds.map(() => '?').join(',')})`,
        connectedIds,
      );
      connectedTanks = rows;
    }

    const [mainStats, ...connectedStats] = await Promise.all([
      calculateTankStats(connection, mainTank, {
        connectedTankIds: connectedIds,
      }),
      ...connectedTanks.map((tank) =>
        calculateTankStats(connection, tank, {
          connectedTankIds: [mainTank.id],
          adminCardValue: tank.movingCard,
        }),
      ),
    ]);

    const [lastPricedReceiptRaw] = await connection.query(
      `SELECT id, timestamp, liters, price_per_liter, last_liters_balance, last_average_price
        FROM fuel_tanks_receipts
        WHERE tank_id = ? AND is_active = 1 AND price_per_liter > 0
        ORDER BY timestamp DESC
        LIMIT 1`,
      [mainTank.id],
    );

    const lastPriced = lastPricedReceiptRaw[0];
    const calculatedAvgPrice = calculateAveragePrice(lastPriced);

    if (lastPriced) {
      await connection.query(
        `UPDATE fuel_tanks_receipts 
          SET last_average_price = ? 
          WHERE tank_id = ? 
          AND is_active = 1 
          AND (price_per_liter IS NULL OR price_per_liter = 0)
          AND timestamp >= ?`,
        [calculatedAvgPrice, mainTank.id, lastPriced.timestamp],
      );
    }

    res.json({
      mainTank: {
        ...mainStats,
        averagePrice: calculatedAvgPrice,
      },
      connectedTanks: connectedStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export {
  getAllFuelTanks,
  getAllFuelTanksWithConnected,
  createMainTank,
  createConnectedTank,
  updateFuelTank,
  deleteFuelTank,
  getFuelTankStatsWithConnections,
};
