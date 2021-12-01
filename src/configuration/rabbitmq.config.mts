import type { RmqOptions} from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import type { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { RMQ_QUEUE } from '@/constants/constants.mjs';

const getRmqHost = (): RmqUrl => {
  const hostname = process.env.RABBIT_MQ_HOST;
  const port = Number(process.env.RABBIT_MQ_PORT);
  return { hostname, port };
};

export const rabbitmqClientConfig = (): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
      urls: [getRmqHost()],
      queue: RMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });

export const rabbitmqServerConfig = () => ({
    transport: Transport.RMQ,
    options: {
      urls: [getRmqHost()],
      queue: RMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
      noAck: false,
      prefetchCount: 1,
    },
  });
