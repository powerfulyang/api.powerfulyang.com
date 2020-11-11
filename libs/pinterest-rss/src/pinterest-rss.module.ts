import { Module } from '@nestjs/common';
import { PinterestRssService } from './pinterest-rss.service';

@Module({
  providers: [PinterestRssService],
  exports: [PinterestRssService],
})
export class PinterestRssModule {}
