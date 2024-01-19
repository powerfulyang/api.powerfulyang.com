import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','saltedPassword','salt','nickname','bio','avatar','lastIp','lastAddress','timelineBackgroundId','createdAt','updatedAt']);

export default UserScalarFieldEnumSchema;
