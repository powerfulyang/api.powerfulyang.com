import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const mysqlConfig: TypeOrmModuleOptions = {
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    timezone: '+08:00',
    synchronize: true,
    logging: false,
    entities: [join(__dirname, './**/**.entity{.ts,.js}')],
    migrations: [],
    subscribers: [],
};
export default mysqlConfig;
