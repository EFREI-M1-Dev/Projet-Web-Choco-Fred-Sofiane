import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UserService } from './User.service';
import { UserResolver } from './User.resolver';

@Module({
  imports: [
        BullModule.registerQueue({
            name: 'user-queue',
        }),
    ],
    controllers: [],
    providers: [UserService, UserResolver],
})
export class UserModule {}