import { Controller, Get } from '@nestjs/common';
import { MenuService } from '@/modules/user/menu/menu.service.mjs';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator.mjs';
import { UserService } from '@/modules/user/user.service.mjs';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator.mjs';
import { User } from '@/modules/user/entities/user.entity.mjs';

@Controller('menu')
@JwtAuthGuard()
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MenuController.name);
  }

  @Get()
  menus() {
    return this.menuService.menus();
  }

  @Get('current')
  currentMenus(@UserFromAuth() user: User) {
    return this.userService.getUserMenus(user.id);
  }
}
