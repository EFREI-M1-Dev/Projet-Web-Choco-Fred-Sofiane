import {Routes} from '@nestjs/core';
// import { UserModule } from './user/user.module';
import {HealthCheckModule} from './modules/healthCheck.module';

export const routes: Routes = [
    {
        path: 'ping',
        module: HealthCheckModule,
    }
];