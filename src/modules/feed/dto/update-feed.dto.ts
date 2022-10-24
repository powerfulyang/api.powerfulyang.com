import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateFeedDto } from './create-feed.dto';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {
  @IsNotEmpty()
  @IsNumberString()
  declare id: number;

  @IsNotEmpty()
  declare content: string;

  declare public: boolean;
}
