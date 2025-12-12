import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; 
import { CommonQueryDto } from '../common/dto/common-query.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  findAll(@Query() query: CommonQueryDto) {
    const data = this.userService.findAll(query); 

    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
