import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma.service';
import {Conversation} from "../Conversation/Conversation.model";

@Processor('message-queue')
export class MessageProcessor extends WorkerHost {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async process(job: Job<any>): Promise<void> {
        console.log(`Processing message job with id: ${job.id}`);
        const { conversationId, userId, content, createdAt, updatedAt } = job.data;

        try {
            await this.prisma.message.create({
                data: {
                    conversationId,
                    userId,
                    content,
                    createdAt,
                    updatedAt,
                    deletedAt: null,
                },
            });
            console.log(`Message saved with id: ${job.id}`);
        } catch (error) {
            console.error(`Failed to save message with id: ${job.id}`, error);
        }
    }
}
