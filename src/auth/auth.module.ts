
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';


import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { MailService } from './mail.service';
import { AuthController } from './auth.controller';
import { RolesGuard } from './role/role.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { WsJwtStrategy } from './strategies/ws-jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtContstant } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';



@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global:true,
      secret: JwtContstant.secret,
      signOptions: { expiresIn: JwtContstant.expire }
    }),
  ],
  controllers:[AuthController],
  providers:[RolesGuard,AuthService,LocalStrategy,JwtStrategy,JwtRefreshTokenStrategy, WsJwtStrategy,MailService],
  exports: [AuthService],

})
export class AuthModule {}
