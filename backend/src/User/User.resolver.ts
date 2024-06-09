import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CreateUserInput, User} from './User.model';
import {UserService} from './User.service';
import {NotFoundException, UseGuards} from '@nestjs/common';
import {Conversation} from "../Conversation/Conversation.model";
import {JwtAuthGuard} from "../Auth/Jwt-auth.guard";
import {PickedUser} from "../Auth/Auth.model";

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {
    }

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

    @Query(returns => PickedUser)
    @UseGuards(JwtAuthGuard)
    async profile(@Context() context): Promise<PickedUser> {

        const userId = context.req.user.id;
        const user = await this.userService.findOneById(userId);

        if (!user) {
            throw new NotFoundException(userId);
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
        };
    }

}