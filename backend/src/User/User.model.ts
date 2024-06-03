import {Field, ID, ObjectType} from '@nestjs/graphql';
import {ApiProperty} from "@nestjs/swagger";

@ObjectType({description: 'User'})
export class User {
    @Field(type => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    username: string;

    @Field()
    password: string;
}