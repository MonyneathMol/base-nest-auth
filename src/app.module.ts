
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
     ProfileModule,
      UsersModule,
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot(typeOrmConfig),
      AuthModule,
      ProfileModule,
      UsersModule,],
      
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
