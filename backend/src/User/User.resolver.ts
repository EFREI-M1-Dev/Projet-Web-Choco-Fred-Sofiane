import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateUserInput, User} from './User.model';
import { UserService } from './User.service';
import {NotFoundException, UseGuards} from '@nestjs/common';
import {Conversation} from "../Conversation/Conversation.model";
import {JwtAuthGuard} from "../Auth/Jwt-auth.guard";

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

    @Query(returns => User)
    async findOneById(@Args('id') id: number): Promise<User> {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

    @Query(returns => [Conversation])
    async findConversations(@Args('id') id: number): Promise<Conversation[]> {
        return this.userService.getConversationByUserId(id);
    }

    @Mutation(returns => User)
    async createUser(@Args('data') data: CreateUserInput): Promise<User> {
        return this.userService.createUser(data);
    }

    @Mutation(returns => User)
    async deleteUser(@Args('id') id: number): Promise<User> {
        return this.userService.deleteUser(id);
    }

    @Mutation(returns => User)
    async joinConversation(@Args('userId') userId: number, @Args('conversationId') conversationId: number): Promise<User> {
        return this.userService.joinConversation(userId, conversationId);
    }

    @Query(returns => User)
    @UseGuards(JwtAuthGuard)
    async profile(@Context() context): Promise<User> {
        const userId = context.req.user.userId;
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new NotFoundException(userId);
        }
        return user;
    }

}