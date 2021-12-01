import type { CosBucket } from '@/modules/bucket/entities/bucket.entity.mjs';

export type UploadFileMsg = { sha1: string; suffix: string } & Pick<CosBucket, 'name'>;

export type UploadFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};
