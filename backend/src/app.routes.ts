import { Routes } from '@nestjs/core';
import { HealthCheckModule } from './HealthCheck/HealthCheck.module';
import { MessageModule } from './Message/Message.module';
import { UserModule } from './User/User.module';

export const routes: Routes = [
  {
    path: 'ping',
    module: HealthCheckModule,
  },
  {
    path: 'message',
    module: MessageModule,
  },
  {
    path: 'user',
    module: UserModule,
  },
];
