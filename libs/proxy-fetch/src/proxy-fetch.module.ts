import { DynamicModule } from '@nestjs/common';
import { ProxyFetchService } from 'api/proxy-fetch/proxy-fetch.service';

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
