import { z } from 'zod';

/////////////////////////////////////////
// USER ROLES ROLE SCHEMA
/////////////////////////////////////////

export const user_roles_roleSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
})

export type user_roles_role = z.infer<typeof user_roles_roleSchema>

/////////////////////////////////////////
// USER ROLES ROLE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const user_roles_roleOptionalDefaultsSchema = user_roles_roleSchema.merge(z.object({
}))

export type user_roles_roleOptionalDefaults = z.infer<typeof user_roles_roleOptionalDefaultsSchema>

export default user_roles_roleSchema;
