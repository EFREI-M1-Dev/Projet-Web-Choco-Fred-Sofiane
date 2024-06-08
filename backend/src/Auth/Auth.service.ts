import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {AuthPayload, LoginInput} from "./Auth.model";
import {PrismaService} from "../prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async generateJwt(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && await bcrypt.compare(pass, user.password)) {
            return user;
        }
        return null;
    }

    async login(loginInput: LoginInput): Promise<AuthPayload> {
        const { email, password } = loginInput;
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new Error('Invalid username or password');
        }

        const token = await this.generateJwt(user);

        return {
            access_token: token.access_token,
            user: { id: user.id, username: user.username, email: user.email }
        };
    }

}
