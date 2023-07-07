import { Module } from '@nestjs/common';
import { ClickUpService } from './click-up.service';
import { ClickUpResolver } from './click-up.resolver';

@Module({
  providers: [ClickUpResolver, ClickUpService],
})
export class ClickUpModule {}
