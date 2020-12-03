export const rabbitmqConfig = () => {
  return {
    host: process.env.RABBIT_MQ_HOST,
    port: process.env.RABBIT_MQ_PORT,
  };
};
