import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Not, Repository } from 'typeorm';

import { PaginateQuery, PaginateConfig, paginate, FilterOperator } from 'nestjs-paginate';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role } from 'src/enums/role';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>,@InjectDataSource() private datasource : DataSource){}
  
  async create(createUserDto: CreateUserDto) {
    var user = await User.userFromDTO(createUserDto);

    return this.userRepository.save(user);
  }

  async findAll(query: PaginateQuery) {
    // Handle filter
    const conf :  PaginateConfig<User> = {
      filterableColumns:{
        email:true
      },
      sortableColumns:['id','created_at']
    }

    const paginateResult = await paginate<User>(query,this.userRepository,conf);
    return paginateResult
  }
  
  findByEmailOrPhone(email:string,phone: string){

    return this.userRepository.findOne({where:[
      {
        phone_number: phone
      },
      
      {
        email:email
      }
    ]
    })
  }
  async assignRole(assignUserId,assignUserRole) {
    // const userRepository = da
    const user = await this.userRepository.findOne({
      where:{
        id:assignUserId,
        // role:Role.UnAssign,
      },
    })

    if (user == null) {
      throw new NotFoundException()
    }

    // at this point should assign the role
    user.role = assignUserRole

    this.userRepository.save({
      id:assignUserId,
      role:assignUserRole
    })
    //console.log(`USERRRR ${user}`)
    return user;

  }

  

  async register(dto: CreateUserDto) : Promise<any> {
    const existingUser = await this.findByEmailOrPhone(dto.email,dto.phone_number);
    if (existingUser) {
      throw new ConflictException('Email or phone is already existed');
    }

    const user = await User.userFromDTO(dto);
    const result = await this.userRepository.save(user);

    return this.getUser(result);
  }


  async registerAdvertiser() {
    
  }

  async findOne(id: string) {
    // return `This action returns a #${id} user`;
    const user = await this.userRepository.findOneOrFail({where:{
      id:id
    }});
    return this.getUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    var updatedDTO = updateUserDto;
    var usr = null;
    const currentUser = await this.userRepository.findOne({where:{id:id}});
    if (currentUser == null) {
      throw new NotFoundException('User not found')
    }

    //Check if email was existed
    if (updateUserDto.email != null && updateUserDto.email != currentUser.email) {
      const isExist = await this.userRepository.exists({where:{email:updateUserDto.email}});
      if (isExist) {
        throw new BadRequestException('This email is already existed.');
      }
    }
    
    if (updatedDTO.password != null) {
      // CHeck if old password is exist
      const user = currentUser.phone_number//updatedDTO.phone_number ?? updatedDTO.email;
      const hasUser = await this.validateUser(user,updatedDTO.old_password ?? '')
      if (hasUser == null) {
        throw new UnauthorizedException()
      }
      usr = await User.userFromDTO(updatedDTO);
    }else {
      usr = await User.userFromDTO(updatedDTO);
    }

    const result = await this.userRepository.update(id,usr);

    
    return {
      "message": "successfullly update user"
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    
    const user = await this.findByEmailOrPhone(username,username);
      if (user){

        const isValid = await User.comparePasswords(pass,user.password) ;
        if (isValid) {
          const { password, ...result } = user;
          return user;
        }
    }
    return null;
  }


  async getUser(user: User) {
    return User.removePassword(user);
  }


  async setCurrentRefreshToken(refreshToken: string, userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken,
    });
  }

  async save(user : User) {
    await this.userRepository.save(user)
  }


  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { email, password } = resetPasswordDto;
    const user = await this.findByEmailOrPhone(email,email);

    if (!user || !user.isVerifiedForReset) {
      throw new UnauthorizedException('User is not authorized to reset password');
    }

    user.password = await User.hashPassword(resetPasswordDto.password)
    user.isVerifiedForReset = false;
    user.verificationCode = null;
    user.verificationCodeExpiration = null;
    // await this.userServices.save(user);

   await this.userRepository.save(user)

   return User.removePassword(user);
    // await this.userServices.update(user.id,)
  }
  
}
