import { z } from 'zod';

/////////////////////////////////////////
// REQUEST LOG SCHEMA
/////////////////////////////////////////

export const request_logSchema = z.object({
  id: z.number(),
  path: z.string(),
  ip: z.string(),
  ipInfo: z.string(),
  method: z.string(),
  statusCode: z.number(),
  contentLength: z.string(),
  processTime: z.string(),
  referer: z.string(),
  userAgent: z.string(),
  requestId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type request_log = z.infer<typeof request_logSchema>

/////////////////////////////////////////
// REQUEST LOG OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const request_logOptionalDefaultsSchema = request_logSchema.merge(z.object({
  id: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type request_logOptionalDefaults = z.infer<typeof request_logOptionalDefaultsSchema>

export default request_logSchema;
