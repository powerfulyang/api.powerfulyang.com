import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateClickUpInput } from './create-click-up.input';

@InputType()
export class UpdateClickUpInput extends PartialType(CreateClickUpInput) {
  @Field(() => Int)
  id: number;
}
