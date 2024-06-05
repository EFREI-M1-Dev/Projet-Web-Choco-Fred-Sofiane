import {Injectable} from '@nestjs/common';
import {User} from './User.model';
import {PrismaService} from "../prisma.service";
import {Conversation, Prisma} from "@prisma/client";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }

    async findOneById(id: number): Promise<User> | null {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            password: user.password,
        };
    }

    async createUser(data: User): Promise<User> {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    username: data.username,
                    password: data.password,
                },
            });

            if (!user) {
                throw new Error('User not created');
            }

            return {
                id: user.id,
                email: user.email,
                username: user.username,
                password: user.password,
            };

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('Email already exists');
                }
            }
            throw new Error('User not created');
        }
    }

    async deleteUser(id: number): Promise<User> {
        const user = await this.prisma.user.delete({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new Error('User not deleted');
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            password: user.password,
        };
    }

    async getConversationByUserId(userId: number): Promise<Conversation[]> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                conversations: true,
            },
        });

        if (!user) {
            return [];
        }

        return user.conversations.map((conversation) => {
            return {
                id: conversation.id,
                name: conversation.name,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt
            };
        });
    }

    async joinConversation(userId: number, conversationId: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                conversations: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const conversation = await this.prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
        });

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                conversations: {
                    connect: {
                        id: conversationId,
                    },
                },
            },
        });

        if (!updatedUser) {
            throw new Error('User not updated');
        }

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            password: updatedUser.password,
        };
    }
}