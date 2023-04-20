import { LoggerModule } from '@/common/logger/logger.module';
import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Module({
  imports: [LoggerModule],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
