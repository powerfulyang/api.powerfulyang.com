import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppLogger } from '@/common/logger/app.logger';
import { Request, Response } from 'express';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/entity/user.entity';
import { Authorization } from '@/constants/constants';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private logger: AppLogger, private userService: UserService) {
    this.logger.setContext(ResponseInterceptor.name);
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = _context.switchToHttp();
    this.logger.debug(`handle in ${ResponseInterceptor.name}`);
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest() as {
      user: { exp: number } & User;
    } & Request;

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`tap in ${ResponseInterceptor.name}`);
      }),
      tap(() => {
        // check token expire time;
        if (request.user) {
          const { user } = request;
          const ValidPeriod = user.exp - Date.now() / 1000;
          this.logger.debug(`token 剩余有效期 ${ValidPeriod}`);
          if (ValidPeriod < 6 * 60 * 60) {
            // 小于6小时 refresh token
            const authorization = this.userService.generateAuthorization(user);
            response.cookie(Authorization, authorization);
          }
        }
      }),
      map((data) => {
        if (data) {
          return {
            status: 'ok',
            data,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }
        return data;
      }),
    );
  }
}
