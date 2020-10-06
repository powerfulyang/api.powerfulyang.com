import { Inject, Injectable } from '@nestjs/common';
import { MICROSERVICE_NAME } from '@/constants/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CoreService {
    constructor(
        @Inject(MICROSERVICE_NAME)
        readonly microserviceClient: ClientProxy,
    ) {}
}
