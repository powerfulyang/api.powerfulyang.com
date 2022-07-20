import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { createParamDecorator, Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { combineLatestAll, concatMap, switchMap, takeWhile } from 'rxjs/operators';
import { from, map, of } from 'rxjs';
import { LoggerService } from '@/common/logger/logger.service';

export const Images = createParamDecorator((_data: number, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { currentPage = 1, pageSize = _data || 10 } = request.query;
  return { skip: (currentPage - 1) * pageSize, take: pageSize };
});

@Injectable()
export class ImagesInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.setContext(ImagesInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    return from(request.file())
      .pipe(concatMap(() => from(request.file())))
      .pipe(
        takeWhile((file) => {
          return file.mimetype.startsWith('image/');
        }),
        map((file) => {
          return of(file);
        }),
        combineLatestAll(),
        switchMap((files) => {
          console.log(files);
          return next.handle();
        }),
      );
  }
}
