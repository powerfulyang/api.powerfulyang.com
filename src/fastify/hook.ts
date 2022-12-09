import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { parseString } from 'xml2js';

const fastifyInstance = fastify();

// adapt passport
fastifyInstance.addHook('onRequest', (request, reply, done) => {
  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  reply.setHeader = function setHeader(key, value) {
    return this.raw.setHeader(key, value);
  };
  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  reply.end = function end() {
    this.raw.end();
  };
  // @ts-ignore
  // eslint-disable-next-line no-param-reassign
  request.res = reply;
  done();
});

fastifyInstance.register(fastifyCookie);
fastifyInstance.register(fastifyMultipart, { addToBody: true });
fastifyInstance.register(fastifyStatic, {
  root: join(process.cwd(), 'assets'),
  decorateReply: false,
});

// handle content-type text/xml
fastifyInstance.addContentTypeParser(['text/xml', 'application/xml'], (_request, payload, done) => {
  let data = '';
  payload.on('data', (chunk) => {
    data += chunk;
  });
  payload.on('end', () => {
    parseString(data, { explicitArray: false, explicitRoot: false }, (err, result) => {
      done(err, result);
    });
  });
});

export default fastifyInstance;
