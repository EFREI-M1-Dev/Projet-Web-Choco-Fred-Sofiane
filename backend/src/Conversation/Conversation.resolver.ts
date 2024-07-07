import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AddConversationInput, Conversation} from './Conversation.model';
import {ConversationService} from './Conversation.service';
import {NotFoundException, UseGuards} from '@nestjs/common';
import { MessageWithUser} from "../Message/Message.model";
import {JwtAuthGuard} from "../Auth/Jwt-auth.guard";

@Resolver(of => Conversation)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

    @Query(returns => Conversation)
    @UseGuards(JwtAuthGuard)
    async conversation(@Args('id') id: number): Promise<Conversation> {
        const user = await this.conversationService.findOneById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

    @Query(returns => [MessageWithUser])
    @UseGuards(JwtAuthGuard)
    async findMessagesByConversationId(@Args('id') id: number): Promise<MessageWithUser[]> {
        return this.conversationService.findMessagesByConversationId(id);
    }

    @Mutation(returns => Conversation)
    @UseGuards(JwtAuthGuard)
    async addConversation(
        @Context() context,
        @Args('name') conversationName: string
    ): Promise<Conversation> {
      const user = context.req.user;
        return await this.conversationService.addConversation(conversationName, user);
    }

    @Mutation(returns => Conversation)
    @UseGuards(JwtAuthGuard)
    async updateConversation(
        @Args('id') id: number,
        @Args('name') name: string,
    ): Promise<void> {
        await this.conversationService.updateConversation(id, name);
    }

    @Mutation(returns => Conversation)
    @UseGuards(JwtAuthGuard)
    async deleteConversation(
        @Args('id') id: number,
    ): Promise<void> {
        await this.conversationService.deleteConversation(id);
    }
}