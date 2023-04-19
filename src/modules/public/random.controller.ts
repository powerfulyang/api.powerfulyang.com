import { Controller, Get, Query, Res } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import { FastifyReply } from 'fastify';
import { join } from 'node:path';
import { CWD } from '@/constants/cookie-path';
import sharp from 'sharp';
import { convertUuidToNumber } from '@/utils/uuid';
import { existsSync, readdirSync } from 'node:fs';
import { randomItem } from '@powerfulyang/utils';
import { ApiTags } from '@nestjs/swagger';

@Controller('random')
@ApiTags('random')
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
    const parsedUuid = (convertUuidToNumber(uuid) % 9999) + 1;
    const dir = join(CWD, 'assets', 'azuki');
    let path = join(dir, `${parsedUuid}.png`);
    if (!existsSync(path)) {
      const files = readdirSync(dir);
      const filename = randomItem(files);
      path = join(dir, filename);
    }
    const s = sharp(path);
    res.type('image/webp');
    res.header('Cache-Control', 'max-age=2592000');
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
