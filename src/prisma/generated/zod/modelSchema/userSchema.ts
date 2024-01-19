import { z } from 'zod';

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  saltedPassword: z.string(),
  salt: z.string(),
  nickname: z.string(),
  bio: z.string(),
  avatar: z.string(),
  lastIp: z.string(),
  lastAddress: z.string(),
  timelineBackgroundId: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type user = z.infer<typeof userSchema>

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const userOptionalDefaultsSchema = userSchema.merge(z.object({
  id: z.number().optional(),
  saltedPassword: z.string().optional(),
  salt: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  lastIp: z.string().optional(),
  lastAddress: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type userOptionalDefaults = z.infer<typeof userOptionalDefaultsSchema>

export default userSchema;
