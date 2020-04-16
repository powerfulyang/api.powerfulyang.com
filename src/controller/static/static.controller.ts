import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Bucket } from '../../entity/bucket.entity';
import { StaticService } from '../../service/static/static.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Static } from '../../entity/static.entity';

@Controller('static')
export class StaticController {
  constructor(private staticService: StaticService) {}

  @Post('bucket')
  add(@Body() bucket: Bucket, @Body() tokenReq: { token: string }) {
    if (tokenReq.token !== process.env.SecretId) {
      throw new BadRequestException();
    }
    return this.staticService.addBucket(bucket);
  }
  @Get('bucket')
  list() {
    return this.staticService.listBucket();
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, cb) => {
        if (!/^(image|video|audio)\//.test(file.mimetype)) {
          return cb(
            new HttpException(
              'Only images are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            null,
          );
        }
        cb(null, true);
      },
    }),
  )
  storeStatic(
    @UploadedFile() file,
    @Body() staticEntity: Static,
    @Body() tokenReq: { token: string },
  ) {
    if (!file || tokenReq.token !== process.env.SecretId) {
      throw new BadRequestException();
    }
    return this.staticService.storeStatic(file, staticEntity);
  }
  @Get()
  listStatic() {
    return this.staticService.list();
  }
  @Post('sha1AllUnHashFile')
  sha1AllUnHashFile() {
    return this.staticService.sha1AllUnHashFile();
  }
}
