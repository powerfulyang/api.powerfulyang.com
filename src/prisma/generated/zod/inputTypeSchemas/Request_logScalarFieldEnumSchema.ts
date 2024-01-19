import { z } from 'zod';

export const Request_logScalarFieldEnumSchema = z.enum(['id','path','ip','ipInfo','method','statusCode','contentLength','processTime','referer','userAgent','requestId','createdAt','updatedAt']);

export default Request_logScalarFieldEnumSchema;
