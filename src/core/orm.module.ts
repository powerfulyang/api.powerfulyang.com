import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from '@/configuration/pg.config';

@Module({
  imports: [TypeOrmModule.forRoot(pgConfig())],
})
export class OrmModule {}
