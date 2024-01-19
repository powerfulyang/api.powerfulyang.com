import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'

/////////////////////////////////////////
// BABY EVENT SCHEMA
/////////////////////////////////////////

export const baby_eventSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayName: z.string(),
  icon: z.string(),
  extraFields: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type baby_event = z.infer<typeof baby_eventSchema>

/////////////////////////////////////////
// BABY EVENT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const baby_eventOptionalDefaultsSchema = baby_eventSchema.merge(z.object({
  id: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type baby_eventOptionalDefaults = z.infer<typeof baby_eventOptionalDefaultsSchema>

export default baby_eventSchema;
