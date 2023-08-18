import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmModule } from '@/service/typeorm/orm.module';
import { Feed } from '@/feed/entities/feed.entity';
import { LoggerModule } from '@/common/logger/logger.module';
import { ClickUpService } from './click-up.service';
import { ClickUpResolver } from './click-up.resolver';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([Feed]), LoggerModule],
  providers: [ClickUpResolver, ClickUpService],
})
export class ClickUpModule {}
