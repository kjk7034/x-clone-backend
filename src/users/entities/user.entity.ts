import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/common.entity';

@ObjectType()
export class User extends CoreEntity {
  @Field()
  email: string;

  @Field()
  nickname: string;
}
