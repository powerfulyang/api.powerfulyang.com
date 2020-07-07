import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticModule } from './module/static.module';
import config from './config';
import { UserModule } from './module/user.module';
import { JwtStrategy } from './common/authorization/JwtStrategy';
import { CoreModule } from './core/core.module';
import { GithubModule } from './github/github.module';

@Module({
    imports: [TypeOrmModule.forRoot(config), CoreModule, StaticModule, UserModule, GithubModule],
    providers: [JwtStrategy],
})
export class AppModule {}
