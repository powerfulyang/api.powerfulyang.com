import type { FastifyRequest } from 'fastify';
import type { User } from '@/modules/user/entities/user.entity';
import type { UploadFile } from '@/type/UploadFile';

export interface ExtendRequest extends FastifyRequest {
  raw: FastifyRequest['raw'] & {
    extend: {
      xRealIp: string;
      address: string;
    };
  };
  user: User & { exp: number };
}

export interface ImagesRequest extends ExtendRequest {
  images: UploadFile[];
}
