import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date;
}

export class UserResponse {
  name: string;
  lastname: string;
  email: string;
  token: string;
  constructor(user: User, token: string) {
    this.name = user.name;
    this.lastname = user.lastname;
    this.email = user.email;
    this.token = token;
  }
}

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

@Entity('promotions')
export class Promotions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}

@Entity('employees')
export class Employees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cedula: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  area: string;
}

@Entity('calls')
export class Calls {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  callDate: Date;

  @Column()
  reason: string;

  @Column({ name: 'contact_method' })
  contactMethod: string;

  @Column()
  comments: string;
}

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  dateTime: Date;

  @OneToOne(() => BranchOffice)
  @JoinColumn({ name: 'branch_office_id' })
  branchOffice: BranchOffice;

  @OneToOne(() => Patient)
  @JoinColumn({ name: 'client_id' })
  patient: Patient;

  @OneToOne(() => Employees)
  @JoinColumn({ name: 'dentist_id' })
  dentist: Employees;

  @OneToOne(() => Employees)
  @JoinColumn({ name: 'receptionist_id' })
  receptionist: Employees;

  @Column({ name: 'appointment_reason', nullable: true })
  appointmentReason: string;

  @Column({ name: 'import_service', nullable: true })
  importService: number;

  @Column({ name: 'payment_method_service', nullable: true })
  paymentMethodService: string;

  @Column({ name: 'import_product', nullable: true })
  importProduct: number;

  @Column({ name: 'payment_method_product', nullable: true })
  paymentMethodProduct: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  comments: string;
}
