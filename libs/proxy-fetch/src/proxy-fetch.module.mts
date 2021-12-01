import type { DynamicModule } from '@nestjs/common';
import { ProxyFetchService } from 'api/proxy-fetch/proxy-fetch.service.mjs';

export class ProxyFetchModule {
  static forRoot(): DynamicModule {
    return {
      module: ProxyFetchModule,
      global: true,
      providers: [ProxyFetchService],
      exports: [ProxyFetchService],
    };
  }
}
