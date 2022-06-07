import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { LoggerService } from '@/common/logger/logger.service';
import type { RequestExtend } from '@/type/RequestExtend';
import { Role } from '@/modules/user/entities/role.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(AdminGuard.name);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<RequestExtend>();
    const { user } = req;
    this.logger.debug(`User ${user.id} is trying to access admin area`);
    const result = user.roles.some((role) => role.roleName === Role.IntendedRoles.admin);
    if (!result) {
      throw new ForbiddenException('You are not authorized to access this area!');
    }
    return result;
  }
}
