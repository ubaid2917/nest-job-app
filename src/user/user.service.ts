import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm'; 
import {CreateUserDto} from './dtos/create-user.dto'; 
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
    async create(createUserDto: CreateUserDto): Promise<User> {
        try { 
            createUserDto.password = await this.hashPassword(createUserDto.password);
            const user = this.userRepository.create(createUserDto);
            return await this.userRepository.save(user);
        } catch (err) {
            throw err.message;
        }
    }
}
