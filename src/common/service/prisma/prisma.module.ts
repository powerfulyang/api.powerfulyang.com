import { LoggerModule } from '@/common/logger/logger.module';
import { PrismaService } from '@/common/service/prisma/prisma.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
