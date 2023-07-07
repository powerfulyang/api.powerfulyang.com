import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ClickUpList {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
