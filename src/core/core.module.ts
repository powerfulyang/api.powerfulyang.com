import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
    MICROSERVICE_NAME,
    RMQ_QUEUE,
    RMQ_URLS,
} from '@/constants/constants';
import { CoreService } from './core.service';

@Global()
@Module({
    imports: [
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
    providers: [CoreService],
    exports: [CoreService],
})
export class CoreModule {}
