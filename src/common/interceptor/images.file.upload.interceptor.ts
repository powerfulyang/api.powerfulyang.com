import { FilesInterceptor } from '@nestjs/platform-express';
import { ForbiddenException, UseInterceptors } from '@nestjs/common';

export const ImagesFileUploadInterceptor = () =>
  FilesInterceptor('files', undefined, {
    fileFilter(
      _req: any,
      file: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      },
      callback: (error: Error | null, acceptFile: boolean) => void,
    ) {
      // file size limit by nginx
      if (/^(image|video|audio)\//.test(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Only image/media are allowed!'), false);
      }
    },
  });

export const ImagesInterceptor = () => UseInterceptors(ImagesFileUploadInterceptor());
