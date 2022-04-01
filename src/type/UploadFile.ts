import type { CosBucket } from '@/modules/bucket/entities/bucket.entity';

export type UploadFileMsg = { sha1: string; suffix: string } & Pick<CosBucket, 'name'>;

export type UploadFile = {
  buffer: Buffer;
};
