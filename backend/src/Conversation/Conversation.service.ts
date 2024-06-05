import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Conversation } from './Conversation.model';

@Injectable()
export class ConversationService {
  constructor(@InjectQueue('conversation-queue') private readonly conversationQueue: Queue) {
  }

  async addConversationJob(name: string): Promise<void> {
    const now = new Date();
    const job = await this.conversationQueue.add('conversation-job', {
      name: name,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
    console.log(`Conversation job added with id: ${job.id}`);
  }

  async updateConversationJob(id: string, name: string): Promise<void> {
    const now = new Date();
    const job = await this.conversationQueue.add('conversation-job', {
      id: id,
      name: name,
      updatedAt: now,
    });
    console.log(`Conversation job updated with id: ${job.id}`);
  }

  async deleteConversationJob(id: string): Promise<void> {
    const now = new Date();
    const job = await this.conversationQueue.add('conversation-job', {
      id: id,
      deletedAt: now,
    });
    console.log(`Conversation job deleted with id: ${job.id}`);
  }

  async findOneById(id: string): Promise<Conversation> | null {
    const conversation = await this.conversationQueue.getJob(id);
    if (!conversation) {
      return null;
    }
    return {
      id: conversation.id,
      name: conversation.data.name,
      createdAt: conversation.data.createdAt,
      updatedAt: conversation.data.updatedAt,
      deletedAt: conversation.data.deletedAt,
    };
  }
}