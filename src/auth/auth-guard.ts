import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
