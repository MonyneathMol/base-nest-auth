import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";


////------ Solution 1 ------
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
      super();
    }

    async validate(username: string, password: string): Promise<any> {
        
      const user = await this.authService.validateUser(username, password);
      if (!user) {
        throw new UnauthorizedException();
      }
      //console.log(`Handle local strategy ${JSON.stringify(user)}`)
      return user;
    }
  }


