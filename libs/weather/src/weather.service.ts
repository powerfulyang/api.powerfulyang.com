import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import fetch from 'node-fetch';
import type { AmapWeather } from '@app/weather/type';
import process from 'node:process';

@Injectable()
export class WeatherService {
  private readonly apiKey = process.env.AMAP_KEY;

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(WeatherService.name);
  }

  async getTodayWeather() {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=310000&key=${this.apiKey}&extensions=base`;
    const res = await fetch(url);
    const json = (await res.json()) as AmapWeather;
    if (json.status !== '0' && json.infocode !== '10000') {
      throw new InternalServerErrorException(json.info);
    }
    const { weather, temperature, winddirection, windpower, humidity, province, city } =
      json.lives[0];
    const description = `${weather}，${temperature}℃，${winddirection}风${windpower}级，湿度${humidity}%`;
    return {
      description,
      weather,
      temperature,
      winddirection,
      windpower,
      humidity,
      province,
      city,
    };
  }
}
