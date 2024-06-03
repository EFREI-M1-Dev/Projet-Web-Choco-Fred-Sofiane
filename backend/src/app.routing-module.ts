import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { routes } from './app.routes';
import { HealthCheckModule } from './HealthCheck/HealthCheck.module';
import { UserModule } from './User/User.module';
import { MessageModule } from './Message/module';

@Module({
  exports: [RouterModule],
  imports: [
    RouterModule.register(routes),
    HealthCheckModule,
    MessageModule,
    UserModule,
  ],
})
export class AppRoutingModule {}
