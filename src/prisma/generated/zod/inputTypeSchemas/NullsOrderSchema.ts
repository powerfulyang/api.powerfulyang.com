import { z } from 'zod';

export const NullsOrderSchema = z.enum(['first','last']);

export default NullsOrderSchema;
