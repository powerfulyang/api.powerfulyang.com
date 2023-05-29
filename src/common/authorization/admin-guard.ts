import { LoggerService } from '@/common/logger/logger.service';
import { Role } from '@/modules/user/entities/role.entity';
import type { FastifyExtendRequest } from '@/type/FastifyExtendRequest';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';

/**
 * @description 需要搭配 @UseGuards(AdminGuard) 使用
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(AdminGuard.name);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<FastifyExtendRequest>();
    const { user } = req;
    this.logger.debug(`User [id=${user.id}] is trying to access admin area`);
    const result = user.roles.some((role) => role.name === Role.IntendedRoles.admin);
    if (!result) {
      throw new ForbiddenException('You are not authorized to access this area!');
    }
    return result;
  }
}
