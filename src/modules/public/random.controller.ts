import { Controller, Get, Query, Res } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FastifyReply } from 'fastify';
import { join } from 'path';
import { CWD } from '@/constants/cookie-path';
import sharp from 'sharp';
import { convertUuidToNumber } from '@/utils/uuid';
import { existsSync, readdirSync } from 'fs';
import { randomItem } from '@powerfulyang/utils';

@Controller('random')
export class RandomController {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(RandomController.name);
  }

  @Get('avatar')
  getAvatar(
    @Query('uuid') uuid: string,
    @Res() res: FastifyReply,
    @Query('size') size: string = '300',
  ) {
    const parsedUuid = convertUuidToNumber(uuid) % 10000;
    const dir = join(CWD, 'assets', 'azuki');
    let path = join(dir, `${parsedUuid}.png`);
    if (!existsSync(path)) {
      const files = readdirSync(dir);
      const filename = randomItem(files);
      path = join(dir, filename);
    }
    const s = sharp(path);
    res.type('image/webp');
    res.header('Cache-Control', 'public, max-age=31536000, immutable');
    return s
      .resize({
        width: Number(size),
        height: Number(size),
      })
      .toFormat('webp')
      .toBuffer()
      .then((data) => {
        res.send(data);
      });
  }
}