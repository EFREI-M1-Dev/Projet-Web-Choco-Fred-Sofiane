import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConversationService } from './Conversation.service';
import { ConversationResolver } from './Conversation.resolver';

@Module({
  imports: [
        BullModule.registerQueue({
            name: 'conversation-queue',
        }),
    ],
    controllers: [],
    providers: [ConversationService, ConversationResolver],
})
export class ConversationModule {}