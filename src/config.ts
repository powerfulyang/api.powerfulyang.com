import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  name: 'default',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  timezone: '+00:00',
  synchronize: true,
  logging: false,
  entities: [join(__dirname, './**/**.entity{.ts,.js}')],
  migrations: [],
  subscribers: [],
  cli: {
    migrationsDir: 'src/migration',
  },
} as TypeOrmModuleOptions;
