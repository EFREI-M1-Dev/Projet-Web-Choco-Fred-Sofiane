import { Controller, Get } from '@nestjs/common';
import {HealthCheckService} from "../services/HealthCheck.service";

@Controller("ping")
export class HealthCheckController {
    constructor(private readonly healthCheckService: HealthCheckService) {}

    @Get()
    async ping(): Promise<string> {
        await this.healthCheckService.addPingJob();
        return this.healthCheckService.ping();
    }
}
