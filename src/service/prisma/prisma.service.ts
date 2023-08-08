import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: LoggerService) {
    super();
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
