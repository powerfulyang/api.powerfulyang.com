import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TencentCloudCosService } from 'api/tencent-cloud-cos/index.mjs';
import { TencentCloudAccount } from '@/modules/tencent-cloud-account/entities/tencent-cloud-account.entity.mjs';

@Injectable()
export class TencentCloudAccountService {
  private readonly cosUtilMap = new Map<number, TencentCloudCosService>();

  constructor(
    @InjectRepository(TencentCloudAccount)
    private readonly accountDao: Repository<TencentCloudAccount>,
  ) {}

  findAll() {
    return this.accountDao.find();
  }

  async getCosUtilByAccountId(id: TencentCloudAccount['id']) {
    const account = await this.accountDao.findOneOrFail(id, {
      select: ['id', 'SecretId', 'SecretKey', 'AppId'],
    });
    return this.getCosUtilByAccount(account);
  }

  private getCosUtilByAccount(account: TencentCloudAccount) {
    let util = this.cosUtilMap.get(account.id);
    if (!util) {
      util = new TencentCloudCosService({
        SecretId: account.SecretId,
        SecretKey: account.SecretKey,
      });
      // TODO 测试一下 key 是否正确
      this.cosUtilMap.set(account.id, util);
    }
    return util;
  }

  async create(account: TencentCloudAccount) {
    return this.accountDao.save(account);
  }
}
