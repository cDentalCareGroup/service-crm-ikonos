import { BranchOffice } from "src/modules/branch_office/models/branch.office.entity";
import { Employees } from "src/modules/employee/models/employee.entity";
import { Patient } from "src/modules/patient/models/patient.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('appointments')
export class Appointments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'branch_id',
    type: 'int',
    comment: 'id de la sucursal donde es la cita',
  })
  branchID: number;
  
  @Column({
    name: 'patient_id',
    type: 'int',
    comment: 'id del paciente',
  })
  patientID: number;

  @Column({
    name: 'dentist_id',
    type: 'int',
    comment: 'id del dentista que atendera la cita',
  })
  dentistID: number;
  
  @Column({
    name: 'receptionist_id',
    type: 'int',
    comment: 'id de la recepcionista que recibio al paciente',
  })
  receptionistID: number;

  @Column({
    name: 'datetime_appointment', 
    type: 'datetime',
    comment: 'fecha hora de la cita',
  })
  dateTimeAppointdment: Date;

  @Column({
    name: 'appointment_type',
    type: 'varchar',
    length: 45,
    comment: 'tipo de cita: seguimiento, cita nueva, reposicion (se cancelo una anterior)',
  })
  appointmentType: string;

  @Column({ 
    name: 'appointment_reason', 
    nullable: true })
  appointmentReason: string;

  @Column({ name: 'import_service', nullable: true })
  importService: number;

  @Column({ name: 'payment_method_service', nullable: true })
  paymentMethodService: string;

  @Column({ name: 'import_product', nullable: true })
  importProduct: number;

  @Column({ name: 'payment_method_product', nullable: true })
  paymentMethodProduct: string;

  @Column({ 
    name: 'status',
    type: "varchar",
    length: 10,
    nullable: false, 
  })
  status: string;

  @Column({
    name: 'comments', 
    type: 'varchar',
    nullable: true,
  })
  comments: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  dateTime: Date;


  // @OneToMany(() => BranchOffice)
  // @JoinColumn({ name: 'branch_office_id' })
  // branchOffice: BranchOffice;

  // @OneToOne(() => Patient)
  // @JoinColumn({ name: 'client_id' })
  // patient: Patient;

  // @OneToOne(() => Employees)
  // @JoinColumn({ name: 'dentist_id' })
  // dentist: Employees;

  // @OneToOne(() => Employees)
  // @JoinColumn({ name: 'receptionist_id' })
  // receptionist: Employees;
}
