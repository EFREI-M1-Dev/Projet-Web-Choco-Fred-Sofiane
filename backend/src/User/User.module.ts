import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UserService } from './User.service';
import { UserResolver } from './User.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService, UserResolver, PrismaService],
})
export class UserModule {}
