import dbTunnel from '../../config/database.js';

const getAllFuelings = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const connection = await dbTunnel.getConnection();

    const [movingCardsRows] = await connection.query(
      'SELECT movingCard FROM fuel_tanks WHERE movingCard IS NOT NULL',
    );

    const movingCards = movingCardsRows
      .map((row) => row.movingCard)
      .filter((card) => card && card.trim().length > 0);

    let query = `
      SELECT
        fe.id,
        fe.event_timestamp,
        COALESCE(fe.driver_ui, fe.driver) AS driver,
        fe.liters,
        fe.amount_uah,
        fe.comment,
        fe.is_active,
        fe.edited_at,
        u.displayName AS edited_by,
        ft.name AS azs_name
      FROM fuel_events fe
      LEFT JOIN fuel_tanks ft ON fe.azs_id = ft.id
      LEFT JOIN users u ON u.id = fe.edited_by
    `;
    const params = [];

    if (
      startDate &&
      endDate &&
      Number(startDate) !== 0 &&
      Number(endDate) !== 0
    ) {
      query += ' WHERE fe.event_timestamp BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY fe.event_timestamp DESC';

    const [fuelings] = await connection.query(query, params);

    const filteredFuelings = fuelings.filter(
      (f) => !movingCards.includes(f.driver),
    );

    const fuelingsWithStringId = filteredFuelings.map((f) => ({
      ...f,
      id: f.id.toString(),
    }));

    res.json(fuelingsWithStringId);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const deleteFueling = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query(
      'DELETE FROM fuel_events WHERE id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Заправку не знайдено' });
    }

    res.status(200).json({ message: 'Заправку успішно видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const updateFueling = async (req, res) => {
  try {
    const { id } = req.params;
    const { driver, liters, amount_uah, comment } = req.body;
    const editedBy = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    const connection = await dbTunnel.getConnection();
    const [rows] = await connection.query(
      'SELECT driver, driver_ui, liters, amount_uah, comment FROM fuel_events WHERE id = ?',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Заправку не знайдено' });
    }

    const current = rows[0];

    const [result] = await connection.query(
      `UPDATE fuel_events
        SET driver_ui = ?, liters = ?, amount_uah = ?, comment = ?, edited_by = ?, edited_at = UNIX_TIMESTAMP(NOW())
        WHERE id = ?`,
      [
        driver ?? current.driver_ui,
        liters ?? current.liters,
        amount_uah ?? current.amount_uah,
        comment ?? current.comment,
        editedBy,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Заправку не знайдено' });
    }

    res.status(200).json({ message: 'Заправку успішно оновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const updateFuelingActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const editedBy = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [rows] = await connection.query(
      `SELECT is_active FROM fuel_events WHERE id = ?`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Заправку не знайдено' });
    }

    const currentStatus = rows[0].is_active;
    const newStatus = currentStatus ? 0 : 1;

    const [result] = await connection.query(
      `UPDATE fuel_events 
       SET is_active = ?, edited_by = ?, edited_at = UNIX_TIMESTAMP(NOW())
       WHERE id = ?`,
      [newStatus, editedBy, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Заправку не знайдено' });
    }

    res.status(200).json({
      message: newStatus
        ? 'Заправку успішно активовано'
        : 'Заправку успішно деактивовано',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export {
  getAllFuelings,
  deleteFueling,
  updateFueling,
  updateFuelingActiveStatus,
};
