import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger';
import { PixivBotService } from 'api/pixiv-bot';
import { Repository } from 'typeorm';
import { Asset } from '@/entity/asset.entity';
import { AssetOrigin } from '@/enum/AssetOrigin';
import { ProxyFetchService } from 'api/proxy-fetch';
import { pHash, sha1 } from '@powerfulyang/node-utils';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { SUCCESS } from '@/constants/constants';
import { getImageSuffix } from '@powerfulyang/utils/src/common/image';

@Injectable()
export class PixivScheduleService {
    constructor(
        private logger: AppLogger,
        private pixivBotService: PixivBotService,
        @InjectRepository(Asset)
        private assetDao: Repository<Asset>,
        private proxyFetchService: ProxyFetchService,
    ) {
        this.logger.setContext(PixivScheduleService.name);
    }

    @Cron('* 30 * * * *')
    async bot() {
        const max = await this.assetDao.findOne({
            order: { id: 'DESC' },
            where: {
                origin: AssetOrigin.pixiv,
            },
        });
        const undoes = await this.pixivBotService.fetchUndo(max?.sn);
        for (const undo of undoes) {
            this.logger.debug(undo);
            const asset = new Asset();
            asset.sn = undo.id;
            asset.originUrl = undo.originUrl;
            asset.tags = undo.tags;
            asset.origin = AssetOrigin.pixiv;
            for (const imgUrl of undo.imgList) {
                const res = await this.proxyFetchService.proxyFetch(
                    imgUrl,
                );
                const buffer = await res.buffer();
                asset.sha1 = sha1(buffer);
                asset.fileSuffix = getImageSuffix(buffer);
                writeFileSync(
                    join(
                        process.cwd(),
                        'assets',
                        asset.sha1 + asset.fileSuffix,
                    ),
                    buffer,
                );
                asset.pHash = await pHash(buffer);
            }
            this.assetDao.insert(asset);
        }
        return SUCCESS;
    }
}
