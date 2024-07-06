import {Field, ID, InputType, ObjectType} from '@nestjs/graphql';

@InputType({ description: 'Input type for creating a new message' })
export class AddMessageJobInput {
  @Field((type) => ID)
  conversationId: number;

  @Field()
  userId: number;

  @Field()
  content: string;
}

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

  @Field()
  deletedAt: Date | null;
}
