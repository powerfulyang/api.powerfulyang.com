import { FilesInterceptor } from '@nestjs/platform-express';
import { ForbiddenException, UseInterceptors } from '@nestjs/common';

export const ImagesFileUploadInterceptor = (filedName: string) =>
  FilesInterceptor(filedName, undefined, {
    fileFilter(_req, file, callback) {
      // file size limit by nginx
      if (/^(image|video|audio)\//.test(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Only image/media are allowed!'), false);
      }
    },
  });

export const ImagesInterceptor = (filedName: string = 'files') =>
  UseInterceptors(ImagesFileUploadInterceptor(filedName));
