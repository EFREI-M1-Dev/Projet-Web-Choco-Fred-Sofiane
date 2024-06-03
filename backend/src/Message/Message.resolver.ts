import { Message } from './Message.model';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessageService } from './Message.service';
import {NotFoundException, Param} from '@nestjs/common';

@Resolver((of) => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query((returns) => Message)
  async message(@Param('id') id: string): Promise<Message> {
    const message = await this.messageService.findOneById(id);
    if (!message) {
      throw new NotFoundException(id);
    }
    return message;
  }

  @Mutation((returns) => Message)
  async addMessageJob(
    @Param('conversationId') conversationId: number,
    @Param('userId') userId: number,
    @Param('content') content: string,
  ): Promise<void> {
    await this.messageService.addMessageJob(conversationId, userId, content);
  }
}
