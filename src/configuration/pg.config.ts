import { join } from 'path';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { __dev__ } from '@powerfulyang/utils';

export const pgConfig = (): TypeOrmModuleOptions => {
  return {
    name: 'default',
    type: 'postgres',
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT) || 5432,
    username: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DATABASE || 'test',
    synchronize: __dev__,
    logging: __dev__,
    entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
    migrations: [],
    subscribers: [],
  };
};
