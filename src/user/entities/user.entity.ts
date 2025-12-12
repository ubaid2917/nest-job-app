import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { BaseEntity } from '../../common/entity/base.entity';
import { UserEducation } from './user-education.entity';
@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({})
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CANDIDATE,
  })
  role: Role; 

  @Column()
  phone: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  resumeUrl: string;  

  @OneToMany(() => UserEducation, (education) => education.user)
  educations: UserEducation[];
}
