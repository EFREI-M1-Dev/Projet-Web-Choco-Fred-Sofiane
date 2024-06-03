import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {HealthCheckService} from "./HealthCheck.service";
import {HealthCheck} from "./HealthCheck.model";

@Resolver(of => HealthCheck)
export class HealthCheckResolver {
    constructor(private readonly healthCheckService: HealthCheckService) {}

    @Query(returns => HealthCheck)
    async healthCheck(@Args('id') id: string): Promise<HealthCheck> {
        const healthCheck = await this.healthCheckService.findOneById(id);
        if (!healthCheck) {
            throw new NotFoundException(id);
        }
        return healthCheck;
    }
}