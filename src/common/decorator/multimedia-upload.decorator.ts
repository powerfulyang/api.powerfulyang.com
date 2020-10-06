import {
    HttpException,
    HttpStatus,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const MultimediaUpload = () => {
    return UseInterceptors(
        FileInterceptor('file', {
            fileFilter: (_req, file, cb) => {
                if (!/^(image|video|audio)\//.test(file.mimetype)) {
                    return cb(
                        new HttpException(
                            'Only images are allowed!',
                            HttpStatus.BAD_REQUEST,
                        ),
                        false,
                    );
                }
                return cb(null, true);
            },
        }),
    );
};
