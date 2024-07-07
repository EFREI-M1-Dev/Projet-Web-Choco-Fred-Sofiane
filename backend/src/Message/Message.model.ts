import {Field, ID, InputType, ObjectType} from '@nestjs/graphql';
import {User} from "../User/User.model";

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

  @Field({ nullable: true })
  deletedAt: Date | null;
}


@ObjectType({ description: 'Message with user' })
export class MessageWithUser {
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

  @Field({ nullable: true })
  deletedAt: Date | null;

  @Field((type) => User, { nullable: true })
  user: {
    username: string;
  };
}

