import {Injectable} from '@nestjs/common';
import {InjectQueue} from '@nestjs/bullmq';
import {Queue} from 'bullmq';
import consola from "consola";

@Injectable()
export class HealthCheckService {
    constructor(@InjectQueue('check-queue') private readonly checkQueue: Queue) {
    }

    async addPingJob(): Promise<void> {
        const job = await this.checkQueue.add('ping-job', {
            message: 'Ping job added',
        });
        consola.info(`${job.data.message} with id: ${job.id}`);
    }

    async ping(): Promise<string> {
        return '🚀PONNNNG!!!!!!!!🚀';
    }
}
