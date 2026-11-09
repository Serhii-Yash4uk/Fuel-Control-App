import dbTunnel from '../../config/database.js';

const getCarLimits = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const connection = await dbTunnel.getConnection();

    const query = `
      SELECT
        c.*,
        IFNULL(SUM(fe.liters), 0) AS filled,
        c.edited_at,
        u.displayName AS edited_by,
        cu.displayName AS created_by
      FROM
        car_limits c
      LEFT JOIN
        fuel_events fe
        ON COALESCE(fe.driver_ui, fe.driver) LIKE CONCAT('%', c.license_plate, '%')
        AND fe.event_timestamp BETWEEN ? AND ?
      LEFT JOIN
        users u ON u.id = c.edited_by
      LEFT JOIN
        users cu ON cu.id = c.created_by
      GROUP BY c.id, u.displayName, cu.displayName
    `;

    const params = [startDate, endDate];
    const [rows] = await connection.query(query, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const createCarLimit = async (req, res) => {
  try {
    const { license_plate, brand_model, limit_liters } = req.body;

    const created_by = req.user.id;
    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query(
      `INSERT INTO car_limits (license_plate, brand_model, limit_liters, is_active, created_by)
   VALUES (?, ?, ?, TRUE, ?)`,
      [license_plate, brand_model, limit_liters, created_by],
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Ліміт для авто успішно створено',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const updateCarLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const { license_plate, brand_model, limit_liters } = req.body;
    const editedBy = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query(
      `UPDATE car_limits
       SET license_plate = ?, 
           brand_model = ?, 
           limit_liters = ?, 
           edited_at = UNIX_TIMESTAMP(NOW()), 
           edited_by = ?
       WHERE id = ?`,
      [license_plate, brand_model, limit_liters, editedBy, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ліміт не знайдено' });
    }

    res.status(200).json({ message: 'Ліміт успішно оновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const updateCarLimitActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const editedBy = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [rows] = await connection.query(
      'SELECT is_active FROM car_limits WHERE id = ?',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ліміт не знайдено' });
    }

    const currentStatus = rows[0].is_active;
    const newStatus = currentStatus ? 0 : 1;

    const [result] = await connection.query(
      `UPDATE car_limits 
       SET is_active = ?, edited_by = ?, edited_at = UNIX_TIMESTAMP(NOW())
       WHERE id = ?`,
      [newStatus, editedBy, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ліміт не знайдено' });
    }

    res.status(200).json({
      message: newStatus
        ? 'Ліміт успішно активовано'
        : 'Ліміт успішно деактивовано',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const deleteCarLimit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query(
      'DELETE FROM car_limits WHERE id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ліміт не знайдено' });
    }

    res.status(200).json({ message: 'Ліміт успішно видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export {
  getCarLimits,
  createCarLimit,
  updateCarLimit,
  updateCarLimitActiveStatus,
  deleteCarLimit,
};
