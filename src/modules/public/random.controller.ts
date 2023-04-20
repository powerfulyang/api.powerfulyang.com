import { LoggerService } from '@/common/logger/logger.service';
import { CWD } from '@/constants/cookie-path';
import { convertUuidToNumber } from '@/utils/uuid';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { randomItem } from '@powerfulyang/utils';
import { FastifyReply } from 'fastify';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

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
