import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { routes } from './app.routes';
import { HealthCheckModule } from './HealthCheck/HealthCheck.module';
import { UserModule } from './User/User.module';
import { MessageModule } from './Message/Message.module';
import {ConversationModule} from "./Conversation/Conversation.module";

@Module({
  exports: [RouterModule],
  imports: [
    RouterModule.register(routes),
    HealthCheckModule,
    MessageModule,
    UserModule,
    ConversationModule
  ],
})
export class AppRoutingModule {}
