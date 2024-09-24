
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtContstant } from '../constants';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService){}

    async canActivate(
      context: ExecutionContext,
    ) {
      const client = context.switchToWs().getClient();
      // //console.log('data client ', client)
      const token = this.extractTokenFromHeader(client.handshake.headers.authorization); // Extract token from query string
      if (!token) {
        return false;
      }

      try {
        const payload = await this.jwtService.verifyAsync(
            token,
            {
                secret: JwtContstant.secret
            }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        client.user  = payload;
    } catch {
        throw new UnauthorizedException();
    }
    // //console.log('client reciecv',client)
    return true;
    }

    private extractTokenFromHeader(existing_token: string | undefined) {
      const [type, token] = existing_token?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
  }
}