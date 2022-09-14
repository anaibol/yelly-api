import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AsyncLocalStorage } from 'async_hooks'
import { Request, Response } from 'express'
import { nanoid } from 'nanoid'
import { Observable } from 'rxjs'

export class RequestContext {
  static cls = new AsyncLocalStorage<any>()

  static get ctx() {
    return this.cls.getStore()
  }

  constructor(public readonly req: Request<any>, public readonly res: Response) {}
}

@Injectable()
// "implements" guide us how to put together an interceptor
export class RequestContextInterceptor implements NestInterceptor {
  // handler refers to the route handler
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context)
    const { req, res } = ctx.getContext()

    RequestContext.cls.enterWith({ requestId: nanoid(), req, res })

    return next.handle()
    // return RequestContext.cls.run({ req, res }, next.handle)
  }
}
