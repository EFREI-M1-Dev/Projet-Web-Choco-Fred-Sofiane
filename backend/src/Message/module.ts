import { BullModule } from '@nestjs/bullmq';
import { MessageResolver } from './resolver';
import { Module } from '@nestjs/common';
import { MessageController } from './controller';
import { MessageService } from './service';

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
