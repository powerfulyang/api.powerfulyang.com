export type UploadFileMsg = { sha1: string; suffix: string; bucketName: string };
export type UploadFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};
