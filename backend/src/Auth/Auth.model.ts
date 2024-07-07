import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class PickedUser {
    @Field(type => Int)
    id: number;

    @Field()
    username: string;

    @Field()
    email: string;
}

@ObjectType()
export class AuthPayload {
    @Field()
    access_token: string;

    @Field()
    refresh_token: string;

    @Field(type => PickedUser)
    user: PickedUser;
}

@InputType()
export class LoginInput {
    @Field()
    email: string;

    @Field()
    password: string;
}
