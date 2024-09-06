import { env } from '../env';
import { Post } from '../entities/models/post.entity';
import { User } from '../entities/models/user.entity';
import { School } from '../entities/models/school.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [Post, User, School],
  migrationsTableName: 'migration',
  migrations: ['src/migrations/*.ts'],
});
