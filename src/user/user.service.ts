import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm'; 
import {CreateUserDto} from './dtos/create-user.dto';

@Injectable()
export class UserService {

    constructor(
       @InjectRepository(User)
       private readonly userRepository: Repository<User>,
    ) { }


    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const user = this.userRepository.create(createUserDto);
            return await this.userRepository.save(user);
        } catch (err) {
            throw err;
        }
    }
}
