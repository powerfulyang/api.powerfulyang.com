import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';
import { MqService } from '@/service/mq/mq.service';
import { MICROSERVICE_NAME } from '@/constants/constants';

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
