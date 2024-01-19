import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'

/////////////////////////////////////////
// BABY EVENT LOG SCHEMA
/////////////////////////////////////////

export const baby_event_logSchema = z.object({
  id: z.number(),
  eventName: z.string(),
  comment: z.string(),
  extra: JsonValueSchema.nullable(),
  eventTime: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type baby_event_log = z.infer<typeof baby_event_logSchema>

/////////////////////////////////////////
// BABY EVENT LOG OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const baby_event_logOptionalDefaultsSchema = baby_event_logSchema.merge(z.object({
  id: z.number().optional(),
  comment: z.string().optional(),
  eventTime: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type baby_event_logOptionalDefaults = z.infer<typeof baby_event_logOptionalDefaultsSchema>

export default baby_event_logSchema;
