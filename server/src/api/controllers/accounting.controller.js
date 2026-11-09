import dbTunnel from '../../config/database.js';

const getAccountingReport = async (req, res) => {
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
        ft.name AS azs_name
      FROM fuel_events fe
      LEFT JOIN fuel_tanks ft ON fe.azs_id = ft.id
      WHERE fe.is_active = 1
    `;
    const params = [];

    if (
      startDate &&
      endDate &&
      Number(startDate) !== 0 &&
      Number(endDate) !== 0
    ) {
      query += ' AND fe.event_timestamp BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY fe.event_timestamp DESC';

    const [fuelings] = await connection.query(query, params);

    const filteredFuelings = fuelings.filter(
      (f) => !movingCards.includes(f.driver),
    );

    res.json(filteredFuelings);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

export { getAccountingReport };
