import { LoggerService } from '@/common/logger/logger.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import process from 'node:process';
import type { AmapRegeoCode, AmapWeather } from 'src/libs/amap';

@Injectable()
export class AmapService {
  private readonly apiKey = process.env.AMAP_KEY;

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(AmapService.name);
  }

  async weatherReport(adcode = 310000) {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${this.apiKey}&extensions=all`;
    const res = await fetch(url);
    const json = (await res.json()) as AmapWeather;
    if (json.status !== '0' && json.infocode !== '10000') {
      throw new InternalServerErrorException(json.info);
    }
    return json;
  }

  async weatherLive(adcode = 310000) {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${this.apiKey}&extensions=base`;
    const res = await fetch(url);
    const json = (await res.json()) as AmapWeather;
    if (json.status !== '0' && json.infocode !== '10000') {
      throw new InternalServerErrorException(json.info);
    }
    return json;
  }

  async regeo(location: string) {
    const url = `https://restapi.amap.com/v3/geocode/regeo?key=${this.apiKey}&location=${location}`;
    const res = await fetch(url);
    const json = (await res.json()) as AmapRegeoCode;
    if (json.status !== '0' && json.infocode !== '10000') {
      throw new InternalServerErrorException(json.info);
    }
    return json;
  }
}
