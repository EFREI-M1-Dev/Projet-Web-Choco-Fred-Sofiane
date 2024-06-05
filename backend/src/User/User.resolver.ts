import {Mutation, Query, Resolver} from '@nestjs/graphql';
import { User } from './User.model';
import { UserService } from './User.service';
import {NotFoundException, Param} from '@nestjs/common';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

    @Query(returns => User)
    async findOneById(@Param('id') id: number): Promise<User> {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

    @Mutation(returns => User)
    async createUser(@Param('data') data: User): Promise<User> {
        return this.userService.createUser(data);
    }

    @Mutation(returns => User)
    async deleteUser(@Param('id') id: number): Promise<User> {
        return this.userService.deleteUser(id);
    }

}