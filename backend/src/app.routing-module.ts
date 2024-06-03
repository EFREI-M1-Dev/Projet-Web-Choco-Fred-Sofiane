import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { routes } from './app.routes';
import { HealthCheckModule } from './HealthCheck/HealthCheck.module';
import {MessageModule} from "./Message/module";
// import { UserModule } from './user/user.module';

@Module({
    exports: [RouterModule],
    imports: [RouterModule.register(routes), HealthCheckModule, MessageModule],
})
export class AppRoutingModule {}