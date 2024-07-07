import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bullmq';
import {ConfigModule, ConfigService} from '@nestjs/config'
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {join} from 'path';
import {HealthCheckResolver} from "./HealthCheck/HealthCheck.resolver";
import {AuthModule} from "./Auth/Auth.module";
import {HealthCheckModule} from "./HealthCheck/HealthCheck.module";
import {MessageModule} from "./Message/Message.module";
import {UserModule} from "./User/User.module";
import {ConversationModule} from "./Conversation/Conversation.module";

@Module({
    imports: [
        HealthCheckModule,
        MessageModule,
        AuthModule,
        UserModule,
        ConversationModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: 6379,
                    password: configService.get<string>('REDIS_PASSWORD'),
                },
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
})
export class AppModule {
}
