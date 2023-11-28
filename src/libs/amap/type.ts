interface BaseResponse {
  status: string;
  info: string;
  infocode: string;
}

export interface Forecast {
  city: string;
  adcode: string;
  province: string;
  reporttime: Date;
  casts: Cast[];
}

export interface Cast {
  date: Date;
  week: string;
  dayweather: string;
  nightweather: string;
  daytemp: string;
  nighttemp: string;
  daywind: string;
  nightwind: string;
  daypower: string;
  nightpower: string;
  daytemp_float: string;
  nighttemp_float: string;
}

export interface Live {
  province: string;
  city: string;
  adcode: string;
  weather: string;
  temperature: string;
  winddirection: string;
  windpower: string;
  humidity: string;
  reporttime: Date;
  temperature_float: string;
  humidity_float: string;
}

export interface AmapWeather extends BaseResponse {
  count: string;
  forecasts: Forecast[];
  lives: Live[];
}

export interface Regeocode {
  addressComponent: AddressComponent;
  formatted_address: string;
}

export interface AddressComponent {
  adcode: string;
  building: Building;
  businessAreas: BusinessArea[];
  city: any[];
  citycode: string;
  country: string;
  district: string;
  neighborhood: Neighborhood;
  province: string;
  streetNumber: StreetNumber;
  towncode: string;
  township: string;
}

export interface Building {
  name: any[];
  type: any[];
}

export interface BusinessArea {
  id: string;
  location: string;
  name: string;
}

export interface Neighborhood {
  name: string;
  type: string;
}

export interface StreetNumber {
  direction: string;
  distance: string;
  location: string;
  number: string;
  street: string;
}

export interface AmapRegeoCode extends BaseResponse, Regeocode {}
