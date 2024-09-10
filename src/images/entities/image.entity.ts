import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Image {
  @Field(() => ID)
  id: string;

  @Field()
  link: string;

  @Field()
  postId: string;
}
