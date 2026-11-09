import dbTunnel from '../config/database.js';
import { verifyToken } from '../helpers/auth.helper.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token)
    return res.status(401).json({ error: 'Токен відсутній.' });

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return res.status(403).json({
      error: 'Авторизаційний токен недійсний. Будь ласка, увійдіть знову.',
      logout: true,
    });
  }

  try {
    const connection = await dbTunnel.getConnection();
    const [rows] = await connection.query(
      'SELECT role, passwordChangedAt FROM users WHERE id = ?',
      [decoded.id],
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        error: 'Користувача не знайдено. Будь ласка, увійдіть знову.',
        logout: true,
      });
    }

    const dbTimestamp = user.passwordChangedAt || null;
    const tokenTimestamp = decoded.passwordChangedAt || null;

    if (dbTimestamp && (!tokenTimestamp || dbTimestamp !== tokenTimestamp)) {
      return res.status(401).json({
        error: 'Дані для входу було змінено. Будь ласка, увійдіть знову.',
        logout: true,
      });
    }

    req.user = { ...decoded, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Доступ заборонено' });
    }
    next();
  };
