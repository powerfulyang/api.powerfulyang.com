import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from '@/common/authorization/JwtStrategy';
import { GoogleStrategy } from '@/common/authorization/GoogleStrategy';

@Global()
@Module({
    providers: [JwtStrategy, GoogleStrategy],
    exports: [JwtStrategy, GoogleStrategy],
})
export class AuthStrategyModule {}
