import {Routes} from '@nestjs/core';
import {HealthCheckModule} from './HealthCheck/HealthCheck.module';

export const routes: Routes = [
    {
        path: 'ping',
        module: HealthCheckModule,
    }
];