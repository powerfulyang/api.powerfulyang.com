import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Bucket } from '../entity/bucket.entity';
import { StaticService } from '../service/static.service';
import { StaticController } from '../controller/static.controller';
import { StaticResource } from '../entity/static.entity';
import {
    MICROSERVICE_NAME,
    RMQ_QUEUE,
    RMQ_URLS,
} from '../constants/constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([Bucket, StaticResource]),
        ClientsModule.register([
            {
                name: MICROSERVICE_NAME,
                transport: Transport.RMQ,
                options: {
                    urls: RMQ_URLS,
                    queue: RMQ_QUEUE,
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
    ],
    providers: [StaticService],
    controllers: [StaticController],
})
export class StaticModule {}
