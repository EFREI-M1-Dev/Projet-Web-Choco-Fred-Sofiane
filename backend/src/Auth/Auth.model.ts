import {ObjectType, Field, Int, InputType} from '@nestjs/graphql';
import { User } from '../user/user.model';

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