import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { QueryPagination } from '@/common/decorator/pagination/pagination.decorator';
import { Permission } from '@/common/decorator/permissions.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { CreateRoleDto } from '@/modules/user/dto/create-role.dto';
import { QueryRolesDto } from '@/modules/user/dto/query-roles.dto';
import { RoleService } from '@/modules/user/role/role.service';
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
import { getEnumValues } from '@powerfulyang/utils';

@Controller('role-manage')
@AdminAuthGuard()
@ApiTags('role-manage')
export class RoleController {
  constructor(private readonly roleService: RoleService, private readonly logger: LoggerService) {
    this.logger.setContext(RoleController.name);
  }

  @Get('query-roles')
  @ApiOperation({
    summary: '分页查询角色',
    operationId: 'queryRoles',
  })
  async queryRoles(@QueryPagination() pagination: QueryRolesDto) {
    return this.roleService.queryRoles(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询角色详情',
    operationId: 'queryRoleById',
  })
  async queryRoleById(@Param('id') id: string) {
    return this.roleService.queryRoleById(id);
  }

  @Post()
  @ApiOperation({
    summary: '创建角色',
    operationId: 'createRole',
  })
  createRole(@Body() role: CreateRoleDto) {
    return this.roleService.createOrUpdateRole(role);
  }

  @Patch()
  @ApiOperation({
    summary: '更新角色',
    operationId: 'updateRole',
  })
  updateRole(@Body() role: CreateRoleDto) {
    return this.roleService.createOrUpdateRole(role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '删除角色',
    operationId: 'deleteRoleById',
  })
  async deleteRoleById(@Param('id') id: number) {
    return this.roleService.deleteRoleById(id);
  }

  @Get('permissions')
  @ApiOperation({
    summary: '获取用户权限',
    operationId: 'listPermissions',
  })
  listPermissions() {
    return getEnumValues(Permission);
  }
}
