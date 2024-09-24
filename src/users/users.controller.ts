import { RolesGuard } from 'src/auth/role/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


import { Roles } from 'src/auth/roles/roles.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Role } from 'src/enums/role';
import { Public } from 'src/auth/constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.usersService.findAll(query);
  }

  
  @Post('register')
  @Public()
  register(@Body() userDTO: CreateUserDto){
      return this.usersService.register(userDTO);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.userId
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('assign_role')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  assignRole(@Body() body){
    const assigner = body.user_id;
    const role = body.role;
    return this.usersService.assignRole(assigner,role)
  }
}
