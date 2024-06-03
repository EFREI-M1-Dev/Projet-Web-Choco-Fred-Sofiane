import { Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { MessageService } from './Message.service';
import { Args } from '@nestjs/graphql';
import { Message } from './Message.model';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  async message(@Args('id') id: string): Promise<Message> {
    const message = await this.messageService.findOneById(id);
    if (!message) {
      throw new NotFoundException(id);
    }
    return message;
  }

  @Post()
  async addMessageJob(
    @Args('conversationId') conversationId: number,
    @Args('userId') userId: number,
    @Args('content') content: string,
  ): Promise<void> {
    await this.messageService.addMessageJob(conversationId, userId, content);
  }
}
