import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.dto';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field()
  id: string;
}
