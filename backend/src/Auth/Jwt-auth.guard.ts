import {Injectable, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    getRequest(context: ExecutionContext    ) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}
