import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReqExtend } from '@/type/ReqExtend';
import { Request } from 'express';
import { AppLogger } from '@/common/logger/app.logger';
import { mergeMap, tap } from 'rxjs/operators';
import { PathViewCountService } from '@/modules/path.view.count/path.view.count.service';

@Injectable()
export class PathViewCountInterceptor implements NestInterceptor {
  constructor(private logger: AppLogger, private pathViewCountService: PathViewCountService) {
    this.logger.setContext(PathViewCountInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<ReqExtend & Request>();
    const path = request.url;
    const { ip } = request.extend;

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`${path} viewed by ${ip}`);
      }),
      mergeMap(async (data) => {
        const count = await this.pathViewCountService.handlePathViewCount(path, ip);
        return Object.assign(data, { pathViewCount: count });
      }),
    );
  }
}
