import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'

/////////////////////////////////////////
// PUSH SUBSCRIPTION LOG SCHEMA
/////////////////////////////////////////

export const push_subscription_logSchema = z.object({
  id: z.number(),
  pushSubscriptionJSON: JsonValueSchema.nullable(),
  endpoint: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.number().nullable(),
})

export type push_subscription_log = z.infer<typeof push_subscription_logSchema>

/////////////////////////////////////////
// PUSH SUBSCRIPTION LOG OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const push_subscription_logOptionalDefaultsSchema = push_subscription_logSchema.merge(z.object({
  id: z.number().optional(),
  endpoint: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type push_subscription_logOptionalDefaults = z.infer<typeof push_subscription_logOptionalDefaultsSchema>

export default push_subscription_logSchema;
