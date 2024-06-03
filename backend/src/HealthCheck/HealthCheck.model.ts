import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'HealthCheck' })
export class HealthCheck {
    @Field(type => ID)
    id: string;

    @Field()
    message: string;
}