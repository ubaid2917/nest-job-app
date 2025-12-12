import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../common/entity/base.entity';
@Entity()
export class UserEducation extends BaseEntity {
  @Column()
  degree: string; 

  @Column()
  institute: string;

  @Column({ nullable: true })
  startYear: number;

  @Column({ nullable: true })
  endYear: number;   

  @ManyToOne(() => User, (user) => user.educations, {
    onDelete: 'CASCADE',
  })
  user: User;
}
