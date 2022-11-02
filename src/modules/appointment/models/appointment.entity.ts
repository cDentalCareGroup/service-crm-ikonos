import { BranchOffice } from "src/modules/branch_office/models/branch.office.entity";
import { Employees } from "src/modules/employee/models/employee.entity";
import { Patient } from "src/modules/patient/models/patient.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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