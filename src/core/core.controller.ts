import { Controller, Get } from '@nestjs/common';

@Controller()
export class CoreController {
    @Get('hello')
    hello() {
        return 'Hello World!';
    }
}
