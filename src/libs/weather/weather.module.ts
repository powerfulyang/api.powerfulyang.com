import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { WeatherService } from './weather.service';

@Module({
  imports: [LoggerModule],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
