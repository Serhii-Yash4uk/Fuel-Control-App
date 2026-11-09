import dbTunnel from '../../config/database.js';

import {
  ROLES,
  hashPassword,
  verifyPassword,
} from '../../helpers/auth.helper.js';

const omitPassword = ({ password, ...user }) => user;

const getUsers = async (_, res) => {
  try {
    const connection = await dbTunnel.getConnection();
    const [rows] = await connection.query(`SELECT * FROM users`);

    res.json(rows.map(omitPassword));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const connection = await dbTunnel.getConnection();
    const userId = req.user.id;
    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    res.json(omitPassword(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, role, displayName } = req.body;

    if (!username || !password || !role || !displayName)
      return res.status(400).json({
        error: 'Будь ласка, введіть логін, пароль, роль та ім’я.',
      });

    if (!ROLES.includes(role))
      return res.status(400).json({ error: 'Невідома роль користувача' });

    const connection = await dbTunnel.getConnection();

    const [rows] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      [username],
    );

    if (rows.length > 0) {
      return res.status(400).json({ error: 'Користувач вже існує' });
    }

    const [result] = await connection.query(
      `INSERT INTO users 
        (username, password, role, displayName)
       VALUES (?, ?, ?, ?)`,
      [username, await hashPassword(password), role, displayName],
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Користувач успішно створений',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, displayName } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: 'Ідентифікатор користувача не вказано' });
    }

    const connection = await dbTunnel.getConnection();
    const [currentRows] = await connection.query(
      'SELECT username, password FROM users WHERE id = ?',
      [id],
    );
    const currentUser = currentRows[0];

    if (!currentUser) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    if (role && !ROLES.includes(role)) {
      return res.status(400).json({ error: 'Невідома роль користувача' });
    }

    if (Number(id) === 1 && role && role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Зміна ролі головного адміністратора заборонена' });
    }

    const usernameChanged = !!username && username !== currentUser.username;
    const passwordChanged =
      !!password && !(await verifyPassword(password, currentUser.password));

    if (usernameChanged) {
      const [existing] = await connection.query(
        'SELECT id FROM users WHERE username = ? AND id <> ?',
        [username, id],
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Користувач вже існує' });
      }
    }

    const updates = [
      { key: 'username', value: username },
      {
        key: 'password',
        value: passwordChanged ? await hashPassword(password) : null,
      },
      { key: 'role', value: role },
      { key: 'displayName', value: displayName },
    ];

    const fields = [];
    const values = [];

    const loginChanged = usernameChanged || passwordChanged;

    updates.forEach(({ key, value }) => {
      if (value) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (loginChanged) {
      fields.push('passwordChangedAt = UNIX_TIMESTAMP(NOW())');
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Немає даних для оновлення' });
    }

    values.push(id);

    const [result] = await connection.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    res.status(200).json({ message: 'Користувача успішно оновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Ідентифікатор не вказано' });
    }

    if (Number(id) === 1) {
      return res
        .status(403)
        .json({ error: 'Видалення головного адміністратора заборонено' });
    }

    const connection = await dbTunnel.getConnection();

    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    res.status(200).json({ message: 'Користувача успішно видалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

export { getUsers, getUserInfo, updateUser, createUser, deleteUser };
