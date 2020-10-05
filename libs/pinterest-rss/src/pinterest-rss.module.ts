import { Module } from '@nestjs/common';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { PinterestRssService } from './pinterest-rss.service';

@Module({
    imports: [ProxyFetchModule],
    providers: [PinterestRssService],
    exports: [PinterestRssService],
})
export class PinterestRssModule {}
