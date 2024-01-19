import { z } from 'zod';

/////////////////////////////////////////
// USER FAMILIES FAMILY SCHEMA
/////////////////////////////////////////

export const user_families_familySchema = z.object({
  userId: z.number(),
  familyId: z.number(),
})

export type user_families_family = z.infer<typeof user_families_familySchema>

/////////////////////////////////////////
// USER FAMILIES FAMILY OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const user_families_familyOptionalDefaultsSchema = user_families_familySchema.merge(z.object({
}))

export type user_families_familyOptionalDefaults = z.infer<typeof user_families_familyOptionalDefaultsSchema>

export default user_families_familySchema;
