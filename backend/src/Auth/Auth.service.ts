import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {AuthPayload, LoginInput, PickedUser} from './Auth.model';
import {PrismaService} from "../prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    async generateJwtToken(user: PickedUser) {
        const payload = { id: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m', // Access token expires in 15 minutes
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d', // Refresh token expires in 7 days
        });
        return { accessToken, refreshToken };
    }

    async validateUser(email: string, password: string): Promise<PickedUser | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user; // Remove password from user object
            return result;
        }
        return null;
    }

    async login(loginInput: LoginInput): Promise<AuthPayload> {
        const { email, password } = loginInput;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const tokens = await this.generateJwtToken(user);
        return {
            user,
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken
        }
    }

    async refreshTokens(refreshToken: string): Promise<AuthPayload> {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                throw new Error('User not found');
            }

            const tokens = await this.generateJwtToken(user);
            return {
                user,
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken
            }
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
