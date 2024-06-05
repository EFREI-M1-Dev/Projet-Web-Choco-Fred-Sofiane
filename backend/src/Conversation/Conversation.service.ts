import { Injectable } from '@nestjs/common';
import { Conversation } from './Conversation.model';
import { PrismaService } from '../prisma.service';
import { Message } from '../Message/Message.model';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {
  }

  async addConversation(name: string): Promise<Conversation> {
    const now = new Date();
    const conversation = await this.prisma.conversation.create({
      data: {
        name: name,
        createdAt: now,
        updatedAt: now,
      },
    });

    if(!conversation) {
      throw new Error('Failed to create conversation');
    }

    return {
      id: conversation.id,
      name: conversation.name,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  async updateConversation(id: number, name: string): Promise<void> {
    const now = new Date();
    await this.prisma.conversation.update({
      where: { id: id },
      data: {
        name: name,
        updatedAt: now,
      },
    });
  }

  async deleteConversation(id: number): Promise<void> {
    await this.prisma.conversation.delete({
      where: { id: id },
    });
  }

  async findOneById(id: number): Promise<Conversation> | null {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: id,
      },
    });

    if (!conversation) {
      return null;
    }

    return {
      id: conversation.id,
      name: conversation.name,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  async findMessagesByConversationId(id: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId: id,
      },
    });

    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      conversationId: message.conversationId,
      userId: message.userId,
      deletedAt: message.deletedAt,
    }));
  }
}