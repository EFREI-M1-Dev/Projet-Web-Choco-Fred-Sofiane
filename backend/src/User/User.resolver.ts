import { Query, Resolver } from '@nestjs/graphql';
import { User } from './User.model';
import { UserService } from './User.service';
import {NotFoundException, Param} from '@nestjs/common';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

    @Query(returns => User)
    async user(@Param('id') id: string): Promise<User> {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }
}