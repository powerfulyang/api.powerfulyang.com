import type { DynamicModule } from '@nestjs/common';
import { ProxyFetchService } from 'api/proxy-fetch/proxy-fetch.service';

export class ProxyFetchModule {
  static forRoot(): DynamicModule {
    return {
      module: ProxyFetchModule,
      providers: [ProxyFetchService],
      exports: [ProxyFetchService],
    };
  }
}
