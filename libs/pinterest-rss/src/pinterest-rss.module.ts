import { Module } from '@nestjs/common';
import { PinterestRssService } from './pinterest-rss.service';
import { CoreModule } from '@/core/core.module';

@Module({
    imports: [CoreModule],
    providers: [PinterestRssService],
    exports: [PinterestRssService],
})
export class PinterestRssModule {}
