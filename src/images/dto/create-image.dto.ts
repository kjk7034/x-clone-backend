import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateImageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  link: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  postId: string;
}
