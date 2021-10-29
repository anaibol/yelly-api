import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const gqlContext = GqlExecutionContext.create(context);
      const request = gqlContext.getContext().req;

      const jwt = this.getJwtFromRequest(request);

      const jwtPayload = this.jwtService.verify(jwt, { algorithms: ['RS256'] });

      request.username = jwtPayload.username

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
  getJwtFromRequest(request): string {
    const authHeader = request.headers.authorization;
    if (authHeader == null) {
      throw new UnauthorizedException();
    }
    const jwt = authHeader.replace('Bearer ', '');

    if (jwt == null) {
      throw new UnauthorizedException();
    }
    return jwt;
  }
}
