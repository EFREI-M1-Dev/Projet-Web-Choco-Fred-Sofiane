import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Message' })
export class Message {
  @Field((type) => ID)
  id: number;

  @Field()
  conversationId: number;

  @Field()
  userId: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
