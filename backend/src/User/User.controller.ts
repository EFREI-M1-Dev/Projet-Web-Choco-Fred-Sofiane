import { Controller, Get, NotFoundException } from '@nestjs/common';
import { UserService } from './User.service';
import { Args } from '@nestjs/graphql';
import { User } from './User.model';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user/:id')
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }
}