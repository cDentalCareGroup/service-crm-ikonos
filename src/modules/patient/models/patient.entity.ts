import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ name: 'birth_day' })
  birthDay: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date;

  @Column({ name: 'created_branch_office', nullable: true })
  createdBranchOffice: string;

  @Column({
    name: 'last_visit_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  lastVisitDate: Date;

  @Column({
    name: 'last_branch_office',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  lastBranchOffice: Date;

  @Column({ nullable: true })
  pad: string;

  @Column({ name: 'pad_type', nullable: true })
  padType: string;

  @Column({
    name: 'acquisition_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  acquisitionDate: Date;

  @Column({
    name: 'expiration_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  expirationDate: Date;

  @Column({ name: 'pad_cost', nullable: true })
  padCost: number;

  @Column({ name: 'client_origin', nullable: true })
  clientOrigin: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  comments: string;
}