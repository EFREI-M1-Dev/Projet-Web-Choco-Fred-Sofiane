import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Message } from './Message.model';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue('message-queue') private readonly messageQueue: Queue,
    private prisma: PrismaService,
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

  async findOneById(id: number): Promise<Message> | null {
    const message = await this.prisma.message.findUnique({
      where: {
        id: id,
      },
    });
    if (!message) {
      return null;
    }

    return {
      id: message.id,
      conversationId: message.conversationId,
      userId: message.userId,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  async editMessageContent(id: number, content: string): Promise<Message> {
    const message = await this.prisma.message.update({
      where: {
        id: id,
      },
      data: {
        content: content,
        updatedAt: new Date(),
      },
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      userId: message.userId,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  async deleteMessage(id: number): Promise<boolean> {
    await this.prisma.message.delete({
      where: {
        id: id,
      },
    });

    return true;
  }
}
