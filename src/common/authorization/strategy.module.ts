import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from '@/common/authorization/jwt.strategy';
import { GoogleStrategy } from '@/common/authorization/google.strategy';

@Global()
@Module({
    providers: [JwtStrategy, GoogleStrategy],
    exports: [JwtStrategy, GoogleStrategy],
})
export class StrategyModule {}
