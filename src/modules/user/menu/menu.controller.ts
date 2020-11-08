import { Controller, Get } from '@nestjs/common';
import { MenuService } from '@/modules/user/menu/menu.service';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';

@Controller('menu')
@JwtAuthGuard()
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Get()
    menus() {
        return this.menuService.menus();
    }
}
