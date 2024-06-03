import { Query, Resolver } from '@nestjs/graphql';
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
}