import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getPostgresConfig();
      },
    }),
  ],
})
export class OrmModule {}
