import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isDevProcess } from '@powerfulyang/utils';
import { getMetadataArgsStorage } from 'typeorm';

export const pgConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: isDevProcess,
  logging: isDevProcess,
  entities: getMetadataArgsStorage().tables.map((t) => t.target),
  extra: {
    max: 10,
  },
});
