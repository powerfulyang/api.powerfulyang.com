import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from '@/common/authorization/JwtStrategy';
import { GoogleStrategy } from '@/common/authorization/GoogleStrategy';
import { ProxyFetchModule } from 'api/proxy-fetch';

@Global()
@Module({
    imports: [ProxyFetchModule],
    providers: [JwtStrategy, GoogleStrategy],
    exports: [JwtStrategy, GoogleStrategy],
})
export class AuthStrategyModule {}
