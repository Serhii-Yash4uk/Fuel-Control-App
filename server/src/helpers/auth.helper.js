import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const ROLES = ['admin', 'fueler', 'accountant'];

const BCRYPT_ROUNDS = 10;
const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$/;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
};

export const signToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });

export const verifyToken = (token) => jwt.verify(token, getJwtSecret());

export const hashPassword = (password) =>
  bcrypt.hash(String(password), BCRYPT_ROUNDS);

export const verifyPassword = async (password, stored) => {
  if (!stored) return false;

  if (BCRYPT_HASH_REGEX.test(stored)) {
    return bcrypt.compare(String(password), stored);
  }

  const a = Buffer.from(String(password));
  const b = Buffer.from(String(stored));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
