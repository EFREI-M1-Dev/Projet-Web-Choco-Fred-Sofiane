import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma.service';
import { SocketGateway } from '../Socket/socket.gateway'; // Assurez-vous que le chemin est correct

@Processor('message-queue')
export class MessageProcessor extends WorkerHost {
    constructor(
        private readonly prisma: PrismaService,
        private readonly socketGateway: SocketGateway, // Injectez le SocketGateway
    ) {
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
            this.socketGateway.sendMessage(conversationId); // Envoyez l'événement au front-end
        } catch (error) {
            console.error(`Failed to save message with id: ${job.id}`, error);
        }
    }
}
