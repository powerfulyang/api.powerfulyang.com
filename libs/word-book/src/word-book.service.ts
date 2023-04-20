import { LoggerService } from '@/common/logger/logger.service';
import { TMT_ACCOUNT } from '@/constants/PROVIDER_TOKEN';
import { TencentCloudAccount } from '@/modules/tencent-cloud-account/entities/tencent-cloud-account.entity';
import { Inject, Injectable } from '@nestjs/common';
import { tmt } from 'tencentcloud-sdk-nodejs';
import type { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_client';

@Injectable()
export class WordBookService {
  private readonly client: Client;

  constructor(
    private readonly logger: LoggerService,
    @Inject(TMT_ACCOUNT) private readonly tmtAccount: TencentCloudAccount,
  ) {
    this.logger.setContext(WordBookService.name);
    this.client = new tmt.v20180321.Client({
      credential: {
        secretId: this.tmtAccount.SecretId,
        secretKey: this.tmtAccount.SecretKey,
      },
      region: 'ap-shanghai',
    });
  }

  async translate(text: string, source = 'auto', target = 'zh') {
    const res = await this.client.TextTranslate({
      SourceText: text,
      Source: source,
      Target: target,
      ProjectId: 0,
    });
    return res.TargetText;
  }
}
