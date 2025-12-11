import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginResponse } from './constants/login.interface'; 
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  @Public()
  async create(@Body() registerUserDto: RegisterUserDto): Promise<any> {
    return await this.AuthService.register(registerUserDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.AuthService.login(loginUserDto);
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.AuthService.refreshToken(refreshToken);
  }
}
