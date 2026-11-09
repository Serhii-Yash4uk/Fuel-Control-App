import dbTunnel from '../../config/database.js';

const getCards = async (_, res) => {
  try {
    const connection = await dbTunnel.getConnection();

    const [rows] = await connection.query(`
      SELECT 
        c.id,
        c.cardName,
        c.edited_at,
        c.type,
        u.displayName AS edited_by
      FROM cards c
      LEFT JOIN users u ON u.id = c.edited_by
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const createCard = async (req, res) => {
  try {
    const { cardName, type = 'FUEL' } = req.body;
    const createdBy = req.user.id;

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query(
      `INSERT INTO cards (cardName, type, edited_at, edited_by)
       VALUES (?, ?, UNIX_TIMESTAMP(NOW()), ?)`,
      [cardName, type, createdBy]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Картка успішно створено',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardName, type } = req.body;
    const editedBy = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query(
      `UPDATE cards 
       SET cardName = ?, type = ?, edited_at = UNIX_TIMESTAMP(NOW()), edited_by = ? 
       WHERE id = ?`,
      [cardName, type, editedBy, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Картка не знайдено' });
    }

    res.status(200).json({ message: 'Картка успішно оновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query('DELETE FROM cards WHERE id = ?', [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Картка не знайдено' });
    }

    res.status(200).json({ message: 'Картка успішно видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export { getCards, createCard, updateCard, deleteCard };
