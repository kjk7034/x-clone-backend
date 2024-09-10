import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateTagInput } from './create-tag.dto';

@InputType()
export class UpdateTagInput extends PartialType(CreateTagInput) {
  @Field()
  id: string;
}
