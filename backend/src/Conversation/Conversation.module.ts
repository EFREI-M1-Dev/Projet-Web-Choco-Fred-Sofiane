import { Module } from '@nestjs/common';
import { ConversationService } from './Conversation.service';
import { ConversationResolver } from './Conversation.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
    controllers: [],
    providers: [ConversationService, ConversationResolver, PrismaService],
})
export class ConversationModule {}