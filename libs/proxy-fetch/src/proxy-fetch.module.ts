import { Module } from '@nestjs/common';
import { ProxyFetchService } from './proxy-fetch.service';

@Module({
    providers: [ProxyFetchService],
    exports: [ProxyFetchService],
})
export class ProxyFetchModule {}
