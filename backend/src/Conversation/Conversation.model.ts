import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Conversation' })
export class Conversation {
  @Field((type) => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

}
