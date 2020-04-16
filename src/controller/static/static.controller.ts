import {
  Body,
  Controller,
  Get,
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
  add(@Body() bucket: Bucket) {
    return this.staticService.addBucket(bucket);
  }
  @Get('bucket')
  list() {
    return this.staticService.listBucket();
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  storeStatic(@UploadedFile() file, @Body() staticEntity: Static) {
    return this.staticService.storeStatic(file, staticEntity);
  }
}
