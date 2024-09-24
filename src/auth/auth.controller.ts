import { JwtRefreshTokenGuard } from './guards/jwt-refresh.guard';
import { Body, Controller, Get, NotFoundException, Param, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordDto } from 'src/users/dto/forget-password.dto';
import { VerifyCodeDto } from 'src/users/dto/verify-code.dto';
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    // @Post('login')
    // signIn(@Body() signInDto: Record<string, any>) {
        // return this.authService.validateUser(signInDto.account, signInDto.password);
    // }


    //This UseGuard will handle the authentication in Local.Stratergy file. '\
    @Get('hello')
    async hello(){
      
      return "heelelelel"
    }

    @UseGuards(JwtRefreshTokenGuard)
    @Post('refresh')
    async refresh(@Req() req) {
      const user = req.user;
      return this.authService.login(user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login/:role?')
    async login(@Request() req,@Param('role') role?: string) {
      //console.log(`Login check`)

      try {
        // Your logic here
        if (role != null) {
          // Should eerform check
          const canLogin = this.authService.validateRole(req.user,role)
          if (canLogin == false ) {
            throw new UnauthorizedException('You don\'t have permission to login')
          }
        }

        const data = await this.authService.login(req.user)
        return data;
        // const data = /* Your data */;
      
      } catch (error) {
        // Handle errors
        // throw new NotFoundException()
        throw error;
      }
    }



    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('verify-code')
    async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
      return this.authService.verifyCode(verifyCodeDto);

      
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.resetPassword(resetPasswordDto);
    }


    @UseGuards(JwtAuthGuard) // show same result
    @Get('profile')
    getProfile(@Request() req) {

      // return req.user;
      return this.authService.getUser(req.user.userId);
    }
}
