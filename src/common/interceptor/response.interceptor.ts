import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppLogger } from '@/common/logger/app.logger';
import { ReturnTypedFunction } from '@powerfulyang/utils';
import { Response } from 'express';
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
    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`in ${ResponseInterceptor.name}`);
      }),
      tap(async () => {
        // check token expire time;
        const request = ctx.getRequest<{
          user: { exp: number } & User;
        }>();
        const response = ctx.getResponse<Response>();
        if (request.user) {
          const { user } = request;
          const ValidPeriod = user.exp - Date.now() / 1000;
          this.logger.debug(`token 剩余有效期 ${ValidPeriod}`);
          if (ValidPeriod < 10 * 60) {
            // 小于10分钟 refresh token
            const authorization = this.userService.generateAuthorization(user);
            response.cookie(Authorization, authorization);
          }
        }
      }),
      tap((data) => {
        if (data) {
          const response = ctx.getResponse<Response>();
          const request = ctx.getRequest() as {
            csrfToken: ReturnTypedFunction<string>;
          };
          this.logger.debug('generate csrf token!');
          response.cookie('_csrf_token', request.csrfToken());
        }
      }),
      map((data) => {
        if (data) {
          return {
            status: 'ok',
            data,
          };
        }
        return data;
      }),
    );
  }
}
