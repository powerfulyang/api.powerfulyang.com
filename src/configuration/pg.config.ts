import process from 'node:process';
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
  logging: false,
  entities: getMetadataArgsStorage().tables.map((t) => t.target),
  extra: {
    // `idleTimeoutMillis: 0`表示数据库连接将永远不会超时并关闭。这可能在某些情况下是可接受的，但需要根据应用的具体需求来判断。
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 10000,
    application_name: 'backend-api',
  },
});
