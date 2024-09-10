import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Image } from '../../images/entities/image.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => User)
  author: User;

  @Field()
  authorId: string;

  @Field(() => [Image], { nullable: true })
  images?: Image[];

  @Field(() => Post, { nullable: true })
  parent?: Post;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => [Post], { nullable: true })
  comments?: Post[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
