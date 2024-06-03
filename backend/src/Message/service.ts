import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Message } from './model';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue('message-queue') private readonly messageQueue: Queue,
  ) {}

  async addMessageJob(
    conversationId: number,
    userId: number,
    content: string,
  ): Promise<void> {
    const now = new Date();
    const job = await this.messageQueue.add('message-job', {
      conversationId: conversationId,
      userId: userId,
      content: content,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
    console.log(`Message job added with id: ${job.id}`);
  }

  async findOneById(id: string): Promise<Message> | null {
    const message = await this.messageQueue.getJob(id);
    if (!message) {
      return null;
    }
    return {
      id: message.id,
      conversationId: message.data.conversationId,
      userId: message.data.userId,
      content: message.data.content,
      createdAt: message.data.createdAt,
      updatedAt: message.data.updatedAt,
      deletedAt: message.data.deletedAt,
    };
  }
}
