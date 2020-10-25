import { Controller, Get } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';

@Controller('asset')
export class AssetController {
    constructor(private assetService: AssetService) {}

    @Get()
    list() {
        return this.assetService.list();
    }
}
