import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from '@/entity/bucket.entity';
import { StaticService } from '@/service/static.service';
import { StaticController } from '@/controller/static.controller';
import { StaticResource } from '@/entity/asset.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Bucket, StaticResource])],
    providers: [StaticService],
    controllers: [StaticController],
})
export class StaticModule {}
