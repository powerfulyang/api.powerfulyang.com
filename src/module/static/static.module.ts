import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from '../../entity/bucket.entity';
import { StaticService } from '../../service/static/static.service';
import { StaticController } from '../../controller/static/static.controller';
import { Static } from '../../entity/static.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bucket, Static])],
  providers: [StaticService],
  controllers: [StaticController],
})
export class StaticModule {}
