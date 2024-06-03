import { Module } from '@nestjs/common';
import {HealthCheckController} from "../controllers/HealthCheck.controller";
import {HealthCheckService} from "../services/HealthCheck.service";
import {BullModule} from "@nestjs/bullmq";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'check-queue',
        }),
    ],
    controllers: [HealthCheckController],
    providers: [HealthCheckService],
})
export class HealthCheckModule {}


