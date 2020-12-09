export const elasticsearchConfig = () => {
  return { node: `http://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}` };
};
