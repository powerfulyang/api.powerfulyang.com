import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { AppLogger } from '@/common/logger/app.logger';
import { Request, Response } from 'express';
import { UserService } from '@/modules/user/user.service';
import { Authorization } from '@/constants/constants';
import { PathViewCountService } from '@/modules/path.view.count/path.view.count.service';
import { ReqExtend } from '@/type/ReqExtend';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private logger: AppLogger,
    private userService: UserService,
    private pathViewCountService: PathViewCountService,
  ) {
    this.logger.setContext(ResponseInterceptor.name);
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = _context.switchToHttp();
    this.logger.debug(`handle in ${ResponseInterceptor.name}`);
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & ReqExtend>();
    const path = request.url;
    const { ip } = request.extend;

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
      mergeMap(async (data) => {
        const count = await this.pathViewCountService.handlePathViewCount(path, ip);
        if (data) {
          return {
            status: 'ok',
            data,
            timestamp: new Date().toISOString(),
            path: request.url,
            pathViewCount: count,
          };
        }
        return data;
      }),
    );
  }
}
