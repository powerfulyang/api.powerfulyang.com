import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormatMiddleware } from './middleware/format/format.middleware';
import { StaticModule } from './module/static/static.module';
import config from './config';

@Module({
  imports: [TypeOrmModule.forRoot(config), StaticModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    /**
     * 2019-10-12 tips: req.body 在app.use(new FormatMiddleware().use)的情况下不能获取值
     * 上面的情况app.use(BodyParser.json())还没有完成，可以（自己手动加上）或者 （configure里面在设置）
     * https://github.com/nestjs/nest/issues/3148#issuecomment-541043223
     */
    consumer.apply(FormatMiddleware).forRoutes('*');
  }
}
