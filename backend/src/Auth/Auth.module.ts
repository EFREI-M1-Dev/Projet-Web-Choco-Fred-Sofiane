import { Module } from '@nestjs/common';
import { AuthService } from './Auth.service';
import {JwtModule} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './Jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {AuthResolver} from "./Auth.resolver";
import {PrismaService} from "../prisma.service";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, AuthResolver, JwtStrategy, PrismaService],
    exports: [AuthService],
})
export class AuthModule {}
