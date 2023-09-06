import type { DynamicModule } from '@nestjs/common';
import { ProxyFetchService } from '@/libs/proxy-fetch';

export class ProxyFetchModule {
  static forRoot(): DynamicModule {
    return {
      module: ProxyFetchModule,
      providers: [ProxyFetchService],
      exports: [ProxyFetchService],
    };
  }
}
