import { rabbitmqConfig } from '@/configuration/rabbitmq.config';

export const MICROSERVICE_NAME = 'RABBIT_MQ_MICROSERVICE';
export const RMQ_URLS = () => {
  const { host, port } = rabbitmqConfig();
  return [`amqp://${host}:${port}`];
};
export const RMQ_QUEUE = 'COS_UPLOAD';
export const COS_UPLOAD_MSG_PATTERN = 'COS_UPLOAD_MSG_PATTERN';
export const SUCCESS = 'SUCCESS';

export const Authorization = 'authorization';
export const Region = 'ap-shanghai';
