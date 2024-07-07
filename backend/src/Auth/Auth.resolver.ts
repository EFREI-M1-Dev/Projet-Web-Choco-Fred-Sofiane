import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './Auth.service';
import { LoginInput, AuthPayload } from './Auth.model';
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "./Jwt-auth.guard";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => AuthPayload)
    async login(@Args('data') loginInput: LoginInput): Promise<AuthPayload> {
        return await this.authService.login(loginInput);
    }

    @Mutation(() => AuthPayload)
    async refreshTokens(@Args('refreshToken') refreshToken: string): Promise<AuthPayload> {
        return await this.authService.refreshTokens(refreshToken);
    }
}
