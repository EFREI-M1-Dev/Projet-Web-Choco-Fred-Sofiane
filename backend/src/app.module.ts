import {AppRoutingModule} from './app.routing-module';
import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bullmq';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import {HealthCheckResolver} from "./HealthCheck/HealthCheck.resolver";

@Module({
    imports: [
        AppRoutingModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: 'localhost',
                    port: 6379,
                    password: configService.get<string>('REDIS_PASSWORD'),
                },
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        })
    ],

})
export class AppModule {
}
