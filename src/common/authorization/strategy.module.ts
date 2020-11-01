import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from '@/common/authorization/jwt.strategy';
import { GoogleStrategy } from '@/common/authorization/google.strategy';
import { UserModule } from '@/modules/user/user.module';

@Global()
@Module({
    imports: [UserModule],
    providers: [JwtStrategy, GoogleStrategy],
    exports: [JwtStrategy, GoogleStrategy],
})
export class StrategyModule {}
