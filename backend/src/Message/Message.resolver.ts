import {AddMessageJobInput, Message} from './Message.model';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import { MessageService } from './Message.service';
import {NotFoundException, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../Auth/Jwt-auth.guard";

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => Message)
  @UseGuards(JwtAuthGuard)
  async message(@Args('id') id: number): Promise<Message> {
    const message = await this.messageService.findOneById(id);
    if (!message) {
      throw new NotFoundException(id);
    }
    return message;
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async addMessageJob( @Args('data') data: AddMessageJobInput): Promise<string> {
    return await this.messageService.addMessageJob(data);
  }

  @Mutation(() => Message)
  @UseGuards(JwtAuthGuard)
  async editMessageContent(
    @Args('id') id: number,
    @Args('content') content: string,
  ): Promise<Message> {
    return this.messageService.editMessageContent(id, content);
  }

  @Mutation(() => Message)
  @UseGuards(JwtAuthGuard)
  async deleteMessage(@Args('id') id: number): Promise<Message> {
    return this.messageService.deleteMessage(id);
  }
}
