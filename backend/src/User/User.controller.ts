import {Controller, Get, NotFoundException, Param} from '@nestjs/common';
import { UserService } from './User.service';
import { User } from './User.model';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async user(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }
}