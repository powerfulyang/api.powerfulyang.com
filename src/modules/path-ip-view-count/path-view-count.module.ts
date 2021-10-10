import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathViewCount } from '@/modules/path-ip-view-count/entities/path-view-count.entity';
import { PathViewCountService } from '@/modules/path-ip-view-count/path-view-count.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PathViewCount])],
  providers: [PathViewCountService],
  exports: [PathViewCountService],
})
export class PathViewCountModule {}