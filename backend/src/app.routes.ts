import {Routes} from '@nestjs/core';
import {HealthCheckModule} from './HealthCheck/HealthCheck.module';
import {MessageModule} from "./Message/module";

export const routes: Routes = [
    {
        path: 'ping',
        module: HealthCheckModule,
    },
    {
        path: 'message',
        module: MessageModule,
    }
];