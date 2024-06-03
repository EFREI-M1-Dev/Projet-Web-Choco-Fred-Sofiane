import {Routes} from '@nestjs/core';
import {HealthCheckModule} from './HealthCheck/HealthCheck.module';
import {UserModule} from "./User/User.module";

export const routes: Routes = [
    {
        path: 'ping',
        module: HealthCheckModule,
    },
    {
        path: 'user',
        module: UserModule
    }
];