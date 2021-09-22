import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from '@/configuration/mysql.config';

@Module({
  imports: [TypeOrmModule.forRoot(mysqlConfig())],
})
export class OrmModule {}
