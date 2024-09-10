import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  count: number;
}
