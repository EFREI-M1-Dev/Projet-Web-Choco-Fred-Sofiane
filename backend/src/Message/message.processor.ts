import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma.service';

@Processor('message-queue')
export class MessageProcessor extends WorkerHost {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async process(job: Job<any>): Promise<void> {
        const { conversationId, userId, content, createdAt, updatedAt } = job.data;

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
    }
}
