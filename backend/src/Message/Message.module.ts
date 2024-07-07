import { BullModule } from '@nestjs/bullmq';
import { MessageResolver } from './Message.resolver';
import { Module } from '@nestjs/common';
import { MessageService } from './Message.service';
import { PrismaService } from '../prisma.service';
import {MessageProcessor} from "./message.processor";
import { SocketModule } from '../Socket/socket.module';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    SocketModule,
  ],
  controllers: [],
  providers: [MessageService, MessageProcessor, MessageResolver, PrismaService],
})
export class MessageModule {}
