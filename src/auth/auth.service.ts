import { BadRequestException, Injectable, Param, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enums/role';
import { UsersService } from 'src/users/users.service';


import { ForgotPasswordDto } from 'src/users/dto/forget-password.dto';
import { VerifyCodeDto } from 'src/users/dto/verify-code.dto';
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtContstant, JwtRefreshContstant } from './constants';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {

    constructor(
        private userServices : UsersService,
        private jwtService: JwtService,
        private readonly mailService: MailService){}


    async validateUser(username: string, pass: string): Promise<any> {
        //console.log(`user ${username} password ${pass}`)
        return this.userServices.validateUser(username,pass);
        
    }

    async validateUserRefreshToken(userId: string, refreshToken: string) {
        console.log('User id recieved',userId)
        const user = await this.userServices.findOne(userId);
        if (user && user.refreshToken === refreshToken) {
          return user;
        }
        return null;
    }
    
    async login(user: any) {
        //this is how to bind 
        
        const payload = {sub: user.id, username: user.phone_number,role:user.role};
        console.log('LOGIN PAYLOAD',payload)
        const accessToken = this.jwtService.sign(payload, {
            secret: JwtContstant.secret,
            expiresIn: JwtContstant.expire,
          });
        const refreshToken = this.jwtService.sign(payload, {
            secret: JwtRefreshContstant.secret,
            expiresIn: JwtRefreshContstant.expire,
        });

        await this.userServices.setCurrentRefreshToken(refreshToken, user.id);

        return {
          access_token: accessToken,
          refresh_token: refreshToken,
        };

        // return {
        //     access_token : await this.jwtService.signAsync(payload),
        //     // user: await this.getUser(user.id)
        // }
    }

    validateRole(user: any,currentRole: String) {

        return user.role == currentRole;
    }

    async getUser(userID:string) {
        const user =  this.userServices.findOne(userID);
        return user;
    }


    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
        const { email } = forgotPasswordDto;
        // const user = await this.userRepository.findOne({ where: { email } });
        // if (!user) {
        //   throw new NotFoundException('User not found');
        // }
        const user = await this.userServices.findByEmailOrPhone(email,email);

        const verificationCode = this.generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry
        await this.userServices.save(user);
    
        // Send verification code via email
        try{
            await this.mailService.sendVerificationCode(email, verificationCode);
            return `code has been sent to ${email}`
        }catch(error){
            throw error
        }
        
      }

      async verifyCode(verifyCodeDto: VerifyCodeDto): Promise<any> {
        const { email, code } = verifyCodeDto;
        const user = await  this.userServices.findByEmailOrPhone(email,email);
    
        if (!user || user.verificationCode !== code) {
          throw new BadRequestException('Invalid verification code');
        }
    
        if (user.verificationCodeExpiration < new Date()) {
          throw new BadRequestException('Verification code has expired');
        }
    
        user.isVerifiedForReset = true;
        await this.userServices.save(user);

        // return User.removePassword(user);
        return {
            'message': 'Success verify',
            'email': user.email
        }
      }
    

      async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
        await this.userServices.resetPassword(resetPasswordDto);
      }
    
      private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
      }
    

}
