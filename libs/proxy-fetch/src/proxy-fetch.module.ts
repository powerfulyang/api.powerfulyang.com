import { Global, Module } from '@nestjs/common';
import { ProxyFetchService } from './proxy-fetch.service';

@Global()
@Module({
  providers: [ProxyFetchService],
  exports: [ProxyFetchService],
})
export class ProxyFetchModule {}
