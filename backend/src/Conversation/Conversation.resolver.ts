import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Conversation } from './Conversation.model';
import { ConversationService } from './Conversation.service';
import {NotFoundException, Param} from '@nestjs/common';

@Resolver(of => Conversation)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

    @Query(returns => Conversation)
    async conversation(@Param('id') id: string): Promise<Conversation> {
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
        await this.conversationService.addConversationJob(name);
    }

    @Mutation(returns => Conversation)
    async updateConversationJob(
        @Param('id') id: string,
        @Param('name') name: string,
    ): Promise<void> {
        await this.conversationService.updateConversationJob(id, name);
    }

    @Mutation(returns => Conversation)
    async deleteConversationJob(
        @Param('id') id: string,
    ): Promise<void> {
        await this.conversationService.deleteConversationJob(id);
    }
}