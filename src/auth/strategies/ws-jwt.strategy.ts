import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { JwtContstant } from '../constants';



@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {

  constructor() {
    // const token = "Bearer " + ExtractJwt.fromUrlQueryParameter('token')
    //console.log(`Hanldle websocket stratergy ${token}`)
    super({
      // jwtFromRequest: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiMDk4MTIzMTIzIiwiaWF0IjoxNzEwOTA5MDY1LCJleHAiOjE3MTExMjUwNjV9.S_vgN9eS8vjQ3ZMmJ0sftfrLrp5eclRAoNGdtU9UNqM',
      ignoreExpiration: false,
      secretOrKey: JwtContstant.secret,
    });
    // super();
  }

  
  async validate(payload: any) {
    //console.log(`Hanldle websocket stratergy`)
    // return true;
    return { userId: payload.sub, username: payload.username };
  }
}
