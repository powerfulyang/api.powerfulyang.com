import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { QueryPagination } from '@/common/decorator/pagination/pagination.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { QueryMenusDto } from '@/user/dto/query-menus.dto';
import { Menu } from '@/user/entities/menu.entity';
import { MenuService } from '@/user/menu/menu.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('menu-manage')
@ApiTags('menu-manage')
@AdminAuthGuard()
export class MenuController {
  constructor(private readonly menuService: MenuService, private readonly logger: LoggerService) {
    this.logger.setContext(MenuController.name);
  }

  @Get('query-menus')
  @ApiOperation({
    summary: '分页获取菜单',
    operationId: 'queryMenus',
  })
  queryMenus(@QueryPagination() pagination: QueryMenusDto) {
    return this.menuService.queryMenus(pagination);
  }

  @Get('query-all-menus')
  @ApiOperation({
    summary: '获取所有菜单',
    operationId: 'queryAllMenus',
  })
  queryAllMenus() {
    return this.menuService.queryAllMenus();
  }

  @Get(':id')
  @ApiOperation({
    summary: '根据id获取菜单',
    operationId: 'queryMenuById',
  })
  queryMenuById(@Param('id') id: string) {
    return this.menuService.queryMenuById(id);
  }

  @Post()
  @ApiOperation({
    summary: '创建菜单',
    operationId: 'createMenu',
  })
  createMenu(@Body() menu: Menu) {
    return this.menuService.createOrEditMenu(menu);
  }

  @Patch()
  @ApiOperation({
    summary: '编辑菜单',
    operationId: 'editMenu',
  })
  editMenu(@Body() menu: Menu) {
    return this.menuService.createOrEditMenu(menu);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '根据id删除菜单',
    operationId: 'deleteMenuById',
  })
  deleteMenuById(@Param('id') id: string) {
    return this.menuService.deleteMenuById(id);
  }
}
