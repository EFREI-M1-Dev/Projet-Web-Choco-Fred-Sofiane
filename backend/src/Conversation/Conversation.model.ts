import {Field, ID, InputType, ObjectType} from '@nestjs/graphql';
import { User} from "../User/User.model";

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

  @Field()
  ownerId: number;

}

@InputType({ description: 'Input type for creating a new conversation' })
export class AddConversationInput {
  @Field()
  name: string;

  @Field((type) => User)
  user: User;
}