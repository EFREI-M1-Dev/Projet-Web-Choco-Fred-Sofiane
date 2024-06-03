import { Module } from '@nestjs/common';
import {HealthCheckController} from "./HealthCheck.controller";
import {HealthCheckService} from "./HealthCheck.service";
import {BullModule} from "@nestjs/bullmq";
import {HealthCheckResolver} from "./HealthCheck.resolver";


@Module({
    imports: [
        BullModule.registerQueue({
            name: 'check-queue',
        }),
    ],
    controllers: [HealthCheckController],
    providers: [HealthCheckService, HealthCheckResolver],
})
export class HealthCheckModule {}


