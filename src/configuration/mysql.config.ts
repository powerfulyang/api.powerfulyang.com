import { join } from 'path';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isDevProcess } from '@powerfulyang/utils';

/**
 * @deprecated
 */
export const mysqlConfig = (): TypeOrmModuleOptions => ({
  name: 'default',
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'test',
  timezone: '+08:00',
  synchronize: isDevProcess,
  logging: true,
  entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
  migrations: [],
  subscribers: [],
});
