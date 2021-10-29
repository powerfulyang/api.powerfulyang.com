import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isProdProcess } from '@powerfulyang/utils';
import { CacheService } from '@/core/cache/cache.service';
import { HOSTNAME } from '@/utils/hostname';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { AppLogger } from '@/common/logger/app.logger';
import { COS_UPLOAD_MSG_PATTERN, MICROSERVICE_NAME } from '@/constants/constants';
import type { UploadFileMsg } from '@/type/UploadFile';

@Injectable()
export class CoreService {
  constructor(
    @Inject(MICROSERVICE_NAME) readonly microserviceClient: ClientProxy,
    private readonly logger: AppLogger,
    private readonly cacheService: CacheService,
  ) {
    this.logger.setContext(CoreService.name);
    this.setCommonNodeUuid().then((uuid) => {
      this.logger.info(`node uuid => ${uuid}`);
    });
  }

  async setCommonNodeUuid() {
    this.logger.info(`当前环境====>${process.env.NODE_ENV}`);
    await this.cacheService.set(REDIS_KEYS.COMMON_NODE, HOSTNAME);
    return HOSTNAME;
  }

  getCommonNodeUuid() {
    return this.cacheService.get(REDIS_KEYS.COMMON_NODE);
  }

  async isCommonNode() {
    const uuid = await this.getCommonNodeUuid();
    return uuid === HOSTNAME;
  }

  async isProdCommonNode() {
    const bool = await this.isCommonNode();
    return bool && isProdProcess;
  }

  notifyCos(notification: UploadFileMsg) {
    return this.microserviceClient.emit(COS_UPLOAD_MSG_PATTERN, notification);
  }
}
