import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Bucket } from '../entity/bucket.entity';
import { StaticService } from '../service/static.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/auth/JwtAuthGuard';
import { StaticResource } from '../entity/static.entity';
import { UploadFile } from '../type/UploadFile';

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
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: (_req, file, cb) => {
                if (!/^(image|video|audio)\//.test(file.mimetype)) {
                    return cb(
                        new HttpException('Only images are allowed!', HttpStatus.BAD_REQUEST),
                        false,
                    );
                }
                cb(null, true);
            },
        }),
    )
    storeStatic(
        @UploadedFile() file: UploadFile,
        @Body('staticResource') staticResource: StaticResource,
        @Body('bucket') bucket: Bucket,
    ) {
        return this.staticService.storeStatic(file, staticResource, bucket);
    }

    @Get()
    list(@Query('projectName') projectName: string) {
        return this.staticService.listStatic(projectName);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    remove(@Body('id') id: number) {
        return this.staticService.remove(id);
    }
}
