import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  permissions: JsonValueSchema.nullable(),
})

export type role = z.infer<typeof roleSchema>

/////////////////////////////////////////
// ROLE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const roleOptionalDefaultsSchema = roleSchema.merge(z.object({
  id: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  permissions: JsonValueSchema.nullable(),
}))

export type roleOptionalDefaults = z.infer<typeof roleOptionalDefaultsSchema>

export default roleSchema;
