import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { AppLogger } from '@/common/logger/app.logger.mjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AdminGuard.name);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    this.logger.info(`User ${user?.id} is trying to access admin area`);
    if (user.id !== 1) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
