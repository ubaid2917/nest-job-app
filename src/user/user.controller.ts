import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
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
  async create(@Body() createEducationDto: CreateEducationDto, @Request() req) { 
    const userId = req.user.id;   
    console.log('userId', req.user)
    const data = await this.userService.createEducation(createEducationDto, userId);
    return {
      data,
    };
  }   

  @Get('education/list')
  async findAllEducation(@Query() query: CommonQueryDto, @Request() req) { 
    const user = req.user; 
    console.log('userId', req.user)
    return this.userService.findAllEducations(query, user);
  }
}
