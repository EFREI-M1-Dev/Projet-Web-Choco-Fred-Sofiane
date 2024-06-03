import { BullModule } from '@nestjs/bullmq';
import { MessageResolver } from './Message.resolver';
import { Module } from '@nestjs/common';
import { MessageController } from './Message.controller';
import { MessageService } from './Message.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
