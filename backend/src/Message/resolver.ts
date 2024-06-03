import { Message } from './model';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessageService } from './service';
import { NotFoundException } from '@nestjs/common';

@Resolver((of) => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query((returns) => Message)
  async message(@Args('id') id: string): Promise<Message> {
    const message = await this.messageService.findOneById(id);
    if (!message) {
      throw new NotFoundException(id);
    }
    return message;
  }

  @Mutation((returns) => Message)
  async addMessageJob(
    @Args('conversationId') conversationId: number,
    @Args('userId') userId: number,
    @Args('content') content: string,
  ): Promise<void> {
    await this.messageService.addMessageJob(conversationId, userId, content);
  }
}
