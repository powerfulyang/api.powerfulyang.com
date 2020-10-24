import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Memoize } from '@powerfulyang/utils';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller()
export class CoreController {
    @Get('/favicon.ico')
    icon(@Res() res: Response) {
        res.send(this.getIconStream());
    }

    @Memoize()
    getIconStream() {
        return readFileSync(join(process.cwd(), 'assets', '04.ico'));
    }
}
