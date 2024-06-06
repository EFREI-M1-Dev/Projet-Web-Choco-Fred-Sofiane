import {Test, TestingModule} from '@nestjs/testing';
import {MessageService} from './Message.service';
import {PrismaService} from '../prisma.service';
import {getQueueToken} from '@nestjs/bullmq';
import {Job, Queue, MinimalQueue} from 'bullmq';
import {AddMessageJobInput, Message} from './Message.model';

describe('MessageService', () => {
    let messageService: MessageService;
    let prismaService: PrismaService;
    let messageQueue: Queue;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessageService,
                {
                    provide: PrismaService,
                    useValue: {
                        message: {
                            findUnique: jest.fn(),
                            findFirst: jest.fn(),
                            update: jest.fn(),
                        },
                    },
                },
                {
                    provide: getQueueToken('message-queue'),
                    useValue: {
                        add: jest.fn(),
                    },
                },
            ],
        }).compile();

        messageService = module.get<MessageService>(MessageService);
        prismaService = module.get<PrismaService>(PrismaService);
        messageQueue = module.get<Queue>(getQueueToken('message-queue'));
    });

    describe('addMessageJob', () => {
        it('should add a message job', async () => {
            const data: AddMessageJobInput = {
                conversationId: 1,
                userId: 1,
                content: 'test message',
            };

            const queueMock = new Queue('message-queue');
            const job = { id: 'job-id' };

            queueMock.add = jest.fn().mockResolvedValue(job);
            queueMock.on = jest.fn();

            jest.spyOn(messageService, 'addMessageJob').mockImplementation(async (input) => {
                await queueMock.add('message-job', input);
                return job.id;
            });

            const result = await messageService.addMessageJob(data);

            expect(result).toBe('job-id');
            expect(queueMock.add).toHaveBeenCalledTimes(1);
            expect(queueMock.add).toHaveBeenCalledWith('message-job', expect.objectContaining({
                conversationId: data.conversationId,
                userId: data.userId,
                content: data.content,
            }));
        });
    });

    describe('findOneById', () => {
        it('should find a message by id', async () => {
            const mockMessage = {
                id: 1,
                conversationId: 1,
                userId: 1,
                content: 'test message',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            jest.spyOn(prismaService.message, 'findUnique').mockResolvedValue(mockMessage);

            const result = await messageService.findOneById(1);
            expect(result).toEqual(mockMessage);
        });

        it('should return null if message not found', async () => {
            jest.spyOn(prismaService.message, 'findUnique').mockResolvedValue(null);

            const result = await messageService.findOneById(1);
            expect(result).toBeNull();
        });
    });

    describe('editMessageContent', () => {
        it('should edit the message content', async () => {
            const mockMessage = {
                id: 1,
                conversationId: 1,
                userId: 1,
                content: 'old content',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            const updatedMessage = {
                ...mockMessage,
                content: 'new content',
                updatedAt: new Date(),
            };
            jest.spyOn(prismaService.message, 'findFirst').mockResolvedValue(mockMessage);
            jest.spyOn(prismaService.message, 'update').mockResolvedValue(updatedMessage);

            const result = await messageService.editMessageContent(1, 'new content');
            expect(result.content).toBe('new content');
            expect(prismaService.message.update).toHaveBeenCalledWith({
                where: {id: 1},
                data: {content: 'new content', updatedAt: expect.any(Date)},
            });
        });

        it('should throw an error if message not found', async () => {
            jest.spyOn(prismaService.message, 'findFirst').mockResolvedValue(null);

            await expect(messageService.editMessageContent(1, 'new content')).rejects.toThrow('Message not found');
        });
    });

    describe('deleteMessage', () => {
        it('should delete the message', async () => {
            const mockMessage = {
                id: 1,
                conversationId: 1,
                userId: 1,
                content: 'test message',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            const deletedMessage = {
                ...mockMessage,
                deletedAt: new Date(),
            };
            jest.spyOn(prismaService.message, 'update').mockResolvedValue(deletedMessage);

            const result = await messageService.deleteMessage(1);
            expect(result.deletedAt).not.toBeNull();
            expect(prismaService.message.update).toHaveBeenCalledWith({
                where: {id: 1},
                data: {deletedAt: expect.any(Date)},
            });
        });
    });
});
