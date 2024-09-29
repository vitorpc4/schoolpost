import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_USER: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_PORT: z.coerce.number().default(5432),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_SECRET_INVITE: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Environment validation error:', _env.error.format());
  throw new Error('Environment validation error');
}

export const env = _env.data;
