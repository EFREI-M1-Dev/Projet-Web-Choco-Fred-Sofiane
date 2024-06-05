import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'User' })
export class User {
  @Field((type) => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
