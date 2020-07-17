import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/authorization/JwtAuthGuard';
import { StaticService } from '../service/static.service';
import { readFileSync } from 'fs';
import { phash } from '@powerfulyang/utils/build/main/lib/image';

// 一些后来添加的特性 补全
@Controller('script')
@UseGuards(JwtAuthGuard)
export class ScriptController {
    constructor(private staticService: StaticService) {}

    @Post('img/pHash')
    async pHash() {
        const [staticList] = await this.staticService.listStatic();
        for (const staticResource of staticList) {
            const originPath = this.staticService.getOriginPath(staticResource);
            const buf = readFileSync(originPath);
            staticResource.pHash = await phash(buf);
            await this.staticService.getStaticDao().save(staticResource);
        }
        return 'ok';
    }
}
