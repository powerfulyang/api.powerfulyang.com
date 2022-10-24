import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICE_NAME } from '@/constants/constants';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';
import { MqService } from '@/common/service/mq/mq.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return configService.getRabbitmqClientConfig();
        },
      },
    ]),
  ],
  exports: [MqService],
  providers: [MqService],
})
export class MqModule {}