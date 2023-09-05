import { AZUKI_ASSET_PATH } from '@/constants/asset_constants';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { randomItem } from '@powerfulyang/utils';
import { FastifyReply } from 'fastify';
import sharp from 'sharp';
import { convertUuidToNumber } from '@/utils/uuid';
import { LoggerService } from '@/common/logger/logger.service';

@Controller('random')
@ApiTags('random')
export class RandomController {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(RandomController.name);
  }

  @Get('avatar')
  async getAvatar(
    @Query('uuid') uuid: string,
    @Res() res: FastifyReply,
    @Query('size') size: string = '300',
  ) {
    const parsedUuid = (convertUuidToNumber(uuid) % 9999) + 1;
    const dir = AZUKI_ASSET_PATH;
    let path = join(dir, `${parsedUuid}.png`);
    if (!existsSync(path)) {
      const files = readdirSync(dir);
      const filename = randomItem(files);
      path = join(dir, filename);
    }
    const s = sharp(path);
    res.type('image/webp');
    res.header('Cache-Control', 'max-age=2592000');
    const data = await s
      .resize({
        width: Number(size),
        height: Number(size),
      })
      .toFormat('webp')
      .toBuffer();
    res.send(data);
  }
}
