import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/common/logger/logger.service';
import { Pagination } from '@/common/decorator/pagination/pagination.decorator';
import { QueryUsersDto } from '@/modules/user/dto/query-users.dto';
import { UserService } from './user.service';

@AdminAuthGuard()
@Controller('user-manage')
@ApiTags('user-manage')
export class UserManageController {
  constructor(private readonly logger: LoggerService, private readonly userService: UserService) {
    this.logger.setContext(UserManageController.name);
  }

  @Post('query-users')
  @ApiOperation({
    summary: '分页查询用户列表',
    operationId: 'queryUsers',
  })
  queryUsers(@Pagination() pagination: QueryUsersDto) {
    return this.userService.queryUsers(pagination);
  }
}
