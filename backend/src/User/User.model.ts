import {Field, ID, InputType, ObjectType} from '@nestjs/graphql';
import {Conversation} from "../Conversation/Conversation.model";

@InputType({description: 'Input type for creating a user'})
export class CreateUserInput {
    @Field()
    email: string;

    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType({description: 'User'})
export class User {
    @Field((type) => ID)
    id: number;

    @Field()
    email: string;

    @Field()
    username: string;

    @Field()
    password: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(type => [Conversation], { nullable: true })
    conversations?: Conversation[];
}
