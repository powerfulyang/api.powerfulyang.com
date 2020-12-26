import { MICROSERVICE_NAME, RMQ_QUEUE } from '@/constants/constants';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';

const getRmqHost = (): RmqUrl => {
  const hostname = process.env.RABBIT_MQ_HOST;
  const port = Number(process.env.RABBIT_MQ_PORT);
  return { hostname, port };
};

export const rabbitmqClientConfig = (): RmqOptions & { name: string } => {
  return {
    name: MICROSERVICE_NAME,
    transport: Transport.RMQ,
    options: {
      urls: [getRmqHost()],
      queue: RMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  };
};

export const rabbitmqServerConfig = () => {
  return {
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
  };
};
