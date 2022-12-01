class AmapWeatherLive {
  province: string;

  city: string;

  adcode: string;

  weather: string;

  temperature: string;

  winddirection: string;

  windpower: string;

  humidity: string;

  reporttime: string;
}

export interface AmapWeather {
  status: string;
  count: string;
  info: string;
  infocode: string;
  lives: AmapWeatherLive[];
}
