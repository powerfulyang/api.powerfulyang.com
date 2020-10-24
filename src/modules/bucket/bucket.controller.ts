import { Controller, Get } from '@nestjs/common';

@Controller('bucket')
export class BucketController {
    @Get()
    list() {
        return [];
    }
}
