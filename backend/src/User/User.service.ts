import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from './User.model';

@Injectable()
export class UserService {
  constructor(@InjectQueue('user-queue') private readonly userQueue: Queue) {
  }

  async findOneById(id: string): Promise<User> | null {
    const user = await this.userQueue.getJob(id);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      username: user.data.username,
      email: user.data.email,
      password: user.data.password,
    };
  }
}