import { TelegramBotModule } from '@/libs/telegram-bot';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { AssetModule } from '@/asset/asset.module';
import { UploadAssetController } from './upload-asset.controller';

@Module({
  imports: [LoggerModule, AssetModule, TelegramBotModule],
  controllers: [UploadAssetController],
})
export class UploadAssetModule {}
