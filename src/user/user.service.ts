import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Brackets, ILike, Repository } from 'typeorm';
import { CommonQueryDto } from '../common/dto/common-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';
import { PaginationUtil } from 'src/utils/pagination.utils';
import { UserEducation } from './entities/user-education.entity';
import { CreateEducationDto } from './dto/create-user-education';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserEducation)
    private readonly userEducationRepo: Repository<UserEducation>,
  ) {}

  async findAll(queryDto: CommonQueryDto): Promise<PaginatedResponse<User>> {
    const where = queryDto.search
      ? {
          name: ILike(`%${queryDto.search}%`),
          email: ILike(`%${queryDto.search}%`),
        }
      : {};

    return PaginationUtil.paginate(
      this.userRepository,
      queryDto.page,
      queryDto.limit,
      where,
    );
  }

  async findOne(id: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (user) {
      const { password, ...result } = user;

      return {
        data: result,
      };
    }
    return { data: null };
  }

  async remove(id: string) {
    const isExist = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!isExist) {
      throw new NotFoundException('Category not found');
    }

    await this.userRepository.delete(id);
    return { message: 'Category deleted successfully' };
  }

  async createEducation(
    createEducationDto: CreateEducationDto,
    userId: string,
  ): Promise<UserEducation> {
    const educationToSave = this.userEducationRepo.create({
      ...createEducationDto,
      user: { id: userId },
    });

    const education = await this.userEducationRepo.save(educationToSave);

    return education;
  }

  async findAllEducations(queryDto: CommonQueryDto, user: any): Promise<any> {
    const take = queryDto.limit ? parseInt(queryDto.limit) : 10;
    const skip = queryDto.page ? (parseInt(queryDto.page) - 1) * take : 0;

    const query = this.userEducationRepo
      .createQueryBuilder('edu')
      .leftJoin('edu.user', 'user')
      .addSelect([
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.profileImage',
      ])
      .take(take)
      .skip(skip);

    if (user.role !== 'admin') {
      query.andWhere('user.id = :userId', { userId: user.id });
    }

    if (queryDto.search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('edu.degree ILIKE :search', {
            search: `%${queryDto.search}%`,
          })
            .orWhere('edu.institute ILIKE :search', {
              search: `%${queryDto.search}%`,
            })
            .orWhere('user.name ILIKE :search', {
              search: `%${queryDto.search}%`,
            });
        }),
      );
    }

    const [data, total] = await query.getManyAndCount();
    return {
      data,
      total,
      page: queryDto.page ? parseInt(queryDto.page) : 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }
}
