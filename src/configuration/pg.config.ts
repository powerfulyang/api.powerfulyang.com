import { join } from 'path';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isDevProcess } from '@powerfulyang/utils';

export const pgConfig = (): TypeOrmModuleOptions => ({
  name: 'default',
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: isDevProcess,
  logging: true,
  entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
  migrations: [],
  subscribers: [],
});
