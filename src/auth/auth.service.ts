import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { Auth } from './entities/auth.entity';
import { hashPassword, comparePassword } from './constants/password.constant';
import {
  generateAccessToken,
  generateRefreshToken,
} from './constants/auth.constant';
import { LoginResponse } from './constants/login.interface';
import { verifyToken } from './constants/auth.constant';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<{
    success: boolean;
    message: string;
    user: Omit<User, 'password'>;
  }> {
    const isUserExist = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (isUserExist) {
      throw new BadRequestException('User with this email already exists');
    }

    registerUserDto.password = await hashPassword(registerUserDto.password);
    const user = this.userRepository.create(registerUserDto);
    const savedUser = await this.userRepository.save(user);

    const { password, ...result } = savedUser;
    return {
      success: true,
      message: 'User registered successfully',
      user: result,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatching = await comparePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...userData } = user;

    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    const isRefreshTokenExist = await this.authRepo.findOne({
      where: { userId: user.id },
    });

    if (isRefreshTokenExist) {
      await this.authRepo.update({ userId: user.id }, { refreshToken });
    } else {
      await this.authRepo.save({
        userId: user.id,
        refreshToken,
      });
    }

    return {
      user: userData,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    const auth = await this.authRepo.findOne({
      where: { userId: decoded.userId },
    });

    if (!auth || auth.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { id: auth.id, email: decoded.email, role: decoded.role };

    const newAccessToken = generateAccessToken({ ...payload });
    const newRefreshToken = generateRefreshToken({ ...payload });

    auth.refreshToken = newRefreshToken;
    await this.authRepo.save(auth);

    return {
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }
}
