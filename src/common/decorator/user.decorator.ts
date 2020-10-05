import { SetMetadata } from '@nestjs/common';

export const User = (...args: string[]) => SetMetadata('user', args);
