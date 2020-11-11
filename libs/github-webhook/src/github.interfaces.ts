import { EventType } from './github.enum';

export type Payload<T> = T;

export interface IHeader {
  'x-github-event': EventType;
  'x-github-delivery': string;
  'x-hub-signature': string;
}
