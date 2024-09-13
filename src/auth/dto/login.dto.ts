import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  deviceId?: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field()
  sessionId: string;
}
