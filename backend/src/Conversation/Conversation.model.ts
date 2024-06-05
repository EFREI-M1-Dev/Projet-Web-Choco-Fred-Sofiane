import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Conversation' })
export class Conversation {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  deletedAt: Date;
}
