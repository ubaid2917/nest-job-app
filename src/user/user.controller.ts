import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateEducationDto } from './dto/create-user-education';
import { CommonQueryDto } from '../common/dto/common-query.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  findAll(@Query() query: CommonQueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }  

  @Post('education')
  create(@Body() createEducationDto: CreateEducationDto) {
    return this.userService.createEducation(createEducationDto);
  }
}
