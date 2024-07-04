import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthPayload, LoginInput } from './Auth.model';
import { AuthService } from './Auth.service';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(returns => AuthPayload)
    async login(@Args('data') loginInput: LoginInput): Promise<AuthPayload> {
        return this.authService.login(loginInput);
    }
}

