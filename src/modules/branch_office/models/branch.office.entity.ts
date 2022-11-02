import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('branch_office')
export class BranchOffice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  email: string;
}