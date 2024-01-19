import { createZodDto } from 'nestjs-zod';
import {
  baby_event_logOptionalDefaultsSchema,
  baby_eventOptionalDefaultsSchema,
  baby_momentOptionalDefaultsSchema,
  r2_bucketOptionalDefaultsSchema,
} from '@/prisma/generated/zod';
import { z } from 'zod';

const primaryKey = z.number().int().positive();

const CreateMomentSchema = baby_momentOptionalDefaultsSchema.extend({
  uploadIds: z.array(primaryKey).optional().default([]),
});

export class CreateBabyMomentDto extends createZodDto(CreateMomentSchema) {}

export class CreateBabyBucketDto extends createZodDto(r2_bucketOptionalDefaultsSchema) {}

const CreateEventSchema = baby_eventOptionalDefaultsSchema.extend({
  extraFields: z.array(z.record(z.string())).optional().default([]),
});

export class CreateBabyEventDto extends createZodDto(CreateEventSchema) {}

export class UpdateBabyEventDto extends createZodDto(CreateEventSchema.omit({ id: true })) {}

const CreateEventLogSchema = baby_event_logOptionalDefaultsSchema.extend({
  extra: z.record(z.string()).optional().default({}),
});

export class CreateBabyEventLogDto extends createZodDto(CreateEventLogSchema) {}

export class UpdateBabyEventLogDto extends createZodDto(CreateEventLogSchema.omit({ id: true })) {}

const QueryEventLogSchema = z.object({
  eventName: z.string().optional(),
  date: z.date().optional(),
});

export class QueryBabyEventLogDto extends createZodDto(QueryEventLogSchema) {}
