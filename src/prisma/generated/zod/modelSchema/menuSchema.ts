import { z } from 'zod';

/////////////////////////////////////////
// MENU SCHEMA
/////////////////////////////////////////

export const menuSchema = z.object({
  id: z.number(),
  path: z.string(),
  parentId: z.number().nullable(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type menu = z.infer<typeof menuSchema>

/////////////////////////////////////////
// MENU OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const menuOptionalDefaultsSchema = menuSchema.merge(z.object({
  id: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type menuOptionalDefaults = z.infer<typeof menuOptionalDefaultsSchema>

export default menuSchema;
