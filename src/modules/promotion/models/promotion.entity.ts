import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('promotions')
export class Promotions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}