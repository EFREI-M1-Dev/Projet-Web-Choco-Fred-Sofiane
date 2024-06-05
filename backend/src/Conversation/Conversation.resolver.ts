import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Conversation } from './Conversation.model';
import { ConversationService } from './Conversation.service';
import {NotFoundException, Param} from '@nestjs/common';
import { Message } from '../Message/Message.model';

@Resolver(of => Conversation)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

    @Query(returns => Conversation)
    async conversation(@Param('id') id: number): Promise<Conversation> {
        const user = await this.conversationService.findOneById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

    @Query(returns => [Message])
    async findMessagesByConversationId(@Param('id') id: number): Promise<Message[]> {
        return this.conversationService.findMessagesByConversationId(id);
    }

    @Mutation(returns => Conversation)
    async addConversation(
        @Param('name') name: string,
    ): Promise<void> {
        await this.conversationService.addConversation(name);
    }

    @Mutation(returns => Conversation)
    async updateConversation(
        @Param('id') id: number,
        @Param('name') name: string,
    ): Promise<void> {
        await this.conversationService.updateConversation(id, name);
    }

    @Mutation(returns => Conversation)
    async deleteConversation(
        @Param('id') id: number,
    ): Promise<void> {
        await this.conversationService.deleteConversation(id);
    }
}