import {Injectable} from '@nestjs/common';
import {Conversation} from './Conversation.model';
import {PrismaService} from '../prisma.service';
import {MessageWithUser} from "../Message/Message.model";
import {User} from "../User/User.model";
import {Context} from "@nestjs/graphql";


@Injectable()
export class ConversationService {
    constructor(private prisma: PrismaService) {
    }

    async addConversation(name: string, user: User): Promise<Conversation> {
        const conversation = await this.prisma.conversation.create({
            data: {
                name: name
            },
        });

        if (!conversation) {
            throw new Error('Failed to create conversation');
        }

        await this.prisma.user.update({
            where: {id: user.id},
            data: {
                conversations: {
                    connect: {
                        id: conversation.id,
                    },
                },
            },
        });

        return conversation;
    }

    async updateConversation(id: number, name: string): Promise<Conversation> {
        const conversation = await this.prisma.conversation.update({
            where: {id: id},
            data: {
                name: name,
            },
        });

        if (!conversation) {
            throw new Error('Failed to update conversation');
        }

        return conversation;
    }

    async deleteConversation(id: number): Promise<void> {
        await this.prisma.conversation.delete({
            where: {id: id},
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

        return conversation;
    }

    async findMessagesByConversationId(id: number): Promise<MessageWithUser[]> {
        const messages = await this.prisma.message.findMany({
            where: {
                conversationId: id,
            },
            include: {
                User: true,
            },
        });

        return messages.map((message) => ({
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            conversationId: message.conversationId,
            userId: message.userId,
            user: {
                username: message.User.username,
            },
            deletedAt: message.deletedAt,
        }));
    }

}