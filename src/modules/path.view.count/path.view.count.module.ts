import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathViewCount } from '@/entity/path.view.count.entity';
import { PathViewCountService } from '@/modules/path.view.count/path.view.count.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PathViewCount])],
  providers: [PathViewCountService],
  exports: [PathViewCountService],
})
export class PathViewCountModule {}
