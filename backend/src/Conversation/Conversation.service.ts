import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Conversation } from './Conversation.model';

@Injectable()
export class ConversationService {
  constructor(@InjectQueue('conversation-queue') private readonly conversationQueue: Queue) {
  }

  async findOneById(id: string): Promise<Conversation> | null {
    const conversation = await this.conversationQueue.getJob(id);
    if (!conversation) {
      return null;
    }
    return {
      id: conversation.id,
      name: conversation.data.name,
    };
  }
}