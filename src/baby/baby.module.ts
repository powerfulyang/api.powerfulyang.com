import { BabyController } from '@/baby/baby.controller';
import { BabyService } from '@/baby/baby.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { S3Module } from '@/libs/s3';
import { PrismaModule } from '@/service/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoggerModule, S3Module, PrismaModule],
  controllers: [BabyController],
  providers: [BabyService],
  exports: [BabyService],
})
export class BabyModule {}
