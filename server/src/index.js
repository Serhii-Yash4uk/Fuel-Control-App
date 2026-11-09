import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import database from './config/database.js';

import authRoutes from './api/routes/auth.routes.js';
import usersRoutes from './api/routes/users.routes.js';
import fuelTanksRoutes from './api/routes/fuelTanks.routes.js';
import fuelTanksReceiptsRoutes from './api/routes/fuelTanksReceipts.routes.js';
import fuelingsRoutes from './api/routes/fuelings.routes.js';
import vehiclesRoutes from './api/routes/vehicles.routes.js';
import accountingRoutes from './api/routes/accounting.routes.js';
import cardsRoutes from './api/routes/cards.routes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Add it to the .env file.');
  process.exit(1);
}

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000'];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : DEFAULT_ALLOWED_ORIGINS;

const app = express();
app.disable('x-powered-by');
app.use(json());

app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, !origin || allowedOrigins.includes(origin)),
  }),
);

app.use('/api', authRoutes);
app.use('/api', authMiddleware);

app.use('/api', vehiclesRoutes);
app.use('/api', fuelingsRoutes);
app.use('/api', fuelTanksRoutes);
app.use('/api', fuelTanksReceiptsRoutes);
app.use('/api', accountingRoutes);
app.use('/api', usersRoutes);
app.use('/api', cardsRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Ресурс не знайдено',
  });
});

const errorMessages = {
  401: 'Неавторизовано',
  403: 'Доступ заборонено',
  404: 'Ресурс не знайдено',
  500: 'Виникла внутрішня помилка сервера',
};

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = errorMessages[status] || 'Невідома помилка';

  console.error(err);

  res.status(status).json({ error: message });
});

const port = process.env.PORT ? +process.env.PORT : 3001;

database
  .connect()
  .then(() => {
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`),
    );
  })
  .catch((err) => {
    console.error(err);
    console.log(`Не вдалося запустити сервер: ${err.message}`);
    process.exit(1);
  });

const shutdown = () => database.close().finally(() => process.exit());

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
