import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const isUserExist = await this.userRepository.findOne({ where: { email: createUserDto.email } });

        if (isUserExist) {
            throw new BadRequestException('User with this email already exists');
        }

        createUserDto.password = await this.hashPassword(createUserDto.password);
        const user = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);

        const { password, ...result } = savedUser;
        return result;
    }
}
