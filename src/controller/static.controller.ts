import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    UploadedFile,
    UseGuards,
} from '@nestjs/common';
import { Bucket } from '@/entity/bucket.entity';
import { StaticService } from '@/service/static.service';
import { JwtAuthGuard } from '@/common/authorization/JwtAuthGuard';
import { UploadFile } from '@/type/UploadFile';
import { MultimediaUpload } from '@/common/decorator/multimedia.upload.decorator';
import { Asset } from '@/entity/asset.entity';

@Controller('static')
export class StaticController {
    constructor(private staticService: StaticService) {}

    @Post('bucket')
    @UseGuards(JwtAuthGuard)
    addBucket(@Body() bucket: Bucket) {
        return this.staticService.addBucket(bucket);
    }

    @Get('bucket')
    @UseGuards(JwtAuthGuard)
    listBucket() {
        return this.staticService.listBucket();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @MultimediaUpload()
    storeStatic(
        @UploadedFile() file: UploadFile,
        @Body('staticResource') staticResource: Asset,
        @Body('bucket') bucket: Bucket,
    ) {
        return this.staticService.storeStatic(
            file,
            staticResource,
            bucket,
        );
    }

    @Get()
    list(
        @Query('projectName') projectName: string,
        @Query('page') page: number,
    ) {
        return this.staticService.listStatic(projectName, page);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    remove(@Body('id') id: number) {
        return this.staticService.remove(id);
    }
}
