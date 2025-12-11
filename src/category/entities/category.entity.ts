import { BaseEntity } from "../../common/entity/base.entity";
import {  Column, Entity } from "typeorm";

@Entity()
export class Category extends BaseEntity {
   
    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;
}
