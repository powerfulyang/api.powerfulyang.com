import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateClickUpInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
