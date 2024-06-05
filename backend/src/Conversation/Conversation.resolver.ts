import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Conversation } from './Conversation.model';
import { ConversationService } from './Conversation.service';
import {NotFoundException, Param} from '@nestjs/common';

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

    @Mutation(returns => Conversation)
    async addConversationJob(
        @Param('name') name: string,
    ): Promise<void> {
        await this.conversationService.addConversation(name);
    }

    @Mutation(returns => Conversation)
    async updateConversationJob(
        @Param('id') id: number,
        @Param('name') name: string,
    ): Promise<void> {
        await this.conversationService.updateConversation(id, name);
    }

    @Mutation(returns => Conversation)
    async deleteConversationJob(
        @Param('id') id: number,
    ): Promise<void> {
        await this.conversationService.deleteConversation(id);
    }
}