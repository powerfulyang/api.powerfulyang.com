import { z } from 'zod';

export const Baby_event_logScalarFieldEnumSchema = z.enum(['id','eventName','comment','extra','eventTime','createdAt','updatedAt']);

export default Baby_event_logScalarFieldEnumSchema;
