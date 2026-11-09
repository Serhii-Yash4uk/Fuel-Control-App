import dbTunnel from '../../config/database.js';
import { signToken, verifyPassword } from '../../helpers/auth.helper.js';

const MAX_FAILED_ATTEMPTS = 10;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map();

const isLocked = (key) => {
  const entry = failedAttempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > LOCK_WINDOW_MS) {
    failedAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
};

const registerFailure = (key) => {
  if (failedAttempts.size > 10000) failedAttempts.clear();
  const entry = failedAttempts.get(key);
  if (!entry || Date.now() - entry.firstAt > LOCK_WINDOW_MS) {
    failedAttempts.set(key, { count: 1, firstAt: Date.now() });
  } else {
    entry.count += 1;
  }
};

const invalidCredentials = (res) =>
  res.status(401).json({
    error: 'Невірний логін або пароль. Перевірте введені дані.',
  });

const login = async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password)
    return res
      .status(400)
      .json({ error: 'Будь ласка, введіть логін і пароль.' });

  const attemptKey = String(username).toLowerCase();
  if (isLocked(attemptKey))
    return res.status(429).json({
      error: 'Забагато невдалих спроб входу. Спробуйте пізніше.',
    });

  try {
    const connection = await dbTunnel.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
    );

    const user = rows[0];
    const valid = !!user && (await verifyPassword(password, user.password));
    if (!valid) {
      registerFailure(attemptKey);
      return invalidCredentials(res);
    }

    failedAttempts.delete(attemptKey);

    const { password: _, ...userData } = user;

    const token = signToken({
      ...userData,
      passwordChangedAt: user.passwordChangedAt || null,
    });

    res.json({ token, user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Помилка сервера',
    });
  }
};

export { login };
