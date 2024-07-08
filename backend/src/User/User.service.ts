import {Injectable} from '@nestjs/common';
import {CreateUserInput, User} from './User.model';
import {PrismaService} from "../prisma.service";
import {Conversation, Prisma} from "@prisma/client";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }

    async findOneById(id: number): Promise<User> | null {

        if (!id) throw new Error('User ID is required');

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });

            if (!user) {
                console.error(`findOneById: User not found for id ${id}`);
                return null;
            }

            return {
                id: user.id,
                email: user.email,
                username: user.username,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        } catch (error) {
            console.error('findOneById: Error fetching user', error);
            return null;
        }
    }

    async createUser(data: CreateUserInput): Promise<User> {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    username: data.username,
                    password: hashedPassword,
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
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
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
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
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

        return user.conversations;
    }

    async joinConversation(userId: number, conversationId: number): Promise<Conversation> {

        try {
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

            await this.prisma.user.update({
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
                include: {conversations: true},
            });

            return conversation;
        } catch (error) {
            console.error('joinConversation: Error joining conversation', error);
            throw error;
        }
    };

}