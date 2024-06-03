import {AppRoutingModule} from './app.routing-module';
import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bullmq';
import {ConfigModule, ConfigService} from '@nestjs/config'

@Module({
    imports: [
        AppRoutingModule,
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
