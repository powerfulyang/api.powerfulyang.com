import { z } from 'zod';

/////////////////////////////////////////
// FAMILY SCHEMA
/////////////////////////////////////////

export const familySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type family = z.infer<typeof familySchema>

/////////////////////////////////////////
// FAMILY OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const familyOptionalDefaultsSchema = familySchema.merge(z.object({
  id: z.number().optional(),
  description: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type familyOptionalDefaults = z.infer<typeof familyOptionalDefaultsSchema>

export default familySchema;
