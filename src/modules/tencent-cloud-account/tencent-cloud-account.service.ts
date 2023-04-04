import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { TencentCloudAccount } from '@/modules/tencent-cloud-account/entities/tencent-cloud-account.entity';
import type { CreateTencentCloudAccountDto } from '@/modules/tencent-cloud-account/dto/create-tencent-cloud-account.dto';

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
    const account = await this.accountDao.findOneOrFail({
      select: ['id', 'SecretId', 'SecretKey', 'AppId'],
      where: { id },
    });
    return this.getCosUtilByAccount(account);
  }

  async getAppIdByAccountId(id: TencentCloudAccount['id']) {
    const account = await this.accountDao.findOneOrFail({
      select: ['id', 'AppId'],
      where: { id },
    });
    return account.AppId;
  }

  getTMTAccount() {
    return this.accountDao.findOneOrFail({
      select: ['id', 'SecretId', 'SecretKey', 'AppId'],
      where: { name: 'tmt' },
    });
  }

  private getCosUtilByAccount(account: TencentCloudAccount) {
    let util = this.cosUtilMap.get(account.id);
    if (!util) {
      util = new TencentCloudCosService({
        SecretId: account.SecretId,
        SecretKey: account.SecretKey,
      });
      // TODO 测试一下 SecretKey & SecretId  是否正确
      this.cosUtilMap.set(account.id, util);
    }
    return util;
  }

  async create(account: CreateTencentCloudAccountDto) {
    return this.accountDao.insert(account);
  }
}
