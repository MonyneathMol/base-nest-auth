import { ExtractJwt,Strategy} from 'passport-jwt';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "../auth.service";
import { JwtRefreshContstant } from '../constants';


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(private authService: AuthService) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JwtRefreshContstant.secret,
            passReqToCallback: true,
          });
    }

    public async validate(req:any, payload: any) {
        console.log('Refresh Token Strategy Called')
        console.log(`Hanldle jwt stratergy payload`,payload.sub)
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        console.log('RECIEVE USRL ', payload)
        const user = await this.authService.validateUserRefreshToken(payload.sub, refreshToken);
        if (!user) {
            console.log('sdafasdf')
        throw new UnauthorizedException();
        }
        return user;
    
    }
    // async validate(payload: any) {
    //     const authUser = await this.authService.getUser(payload.sub)
    //     if (!authUser) {
    //         throw new UnauthorizedException()
    //     }
    //     return {
    //         attribute: authUser,
    //         refreshTokenExpiresAt: new Date(payload.exp * 1000),
    //     }

    //   }
}