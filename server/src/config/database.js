import mysql from 'mysql2/promise';

export const connectionOptions = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl:
    process.env.DATABASE_SSL === 'false'
      ? undefined
      : { minVersion: 'TLSv1.2', rejectUnauthorized: true },
};

const poolOptions = {
  ...connectionOptions,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

let pool = null;

const connect = async () => {
  if (pool) return pool;

  const newPool = mysql.createPool(poolOptions);
  try {
    await newPool.query('SELECT 1');
  } catch (err) {
    await newPool.end();
    throw err;
  }

  pool = newPool;
  return pool;
};

const getConnection = () => connect();

const close = async () => {
  if (!pool) return;

  const current = pool;
  pool = null;
  await current.end();
};

export default { connect, getConnection, close };
