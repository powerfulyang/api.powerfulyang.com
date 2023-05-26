import { IsNotEmpty } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  message: string;

  icon?: string;

  openUrl?: string;

  @IsNotEmpty()
  subscribeId: number;
}
