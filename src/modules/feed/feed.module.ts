import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { AssetModule } from '@/modules/asset/asset.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feed]), AssetModule],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
