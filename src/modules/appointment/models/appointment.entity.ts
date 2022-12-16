// import { BranchOffice } from "src/modules/branch_office/models/branch.office.entity";
// import { Employees } from "src/modules/employee/models/employee.entity";
// import { Patient } from "src/modules/patient/models/patient.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

 @Entity('appointment2')
 export class AppointmentEntity {
  @PrimaryGeneratedColumn({name:'ID'})
  id: number;

  @Column({
    name: 'appointment',
    type: 'date',
  })
  appointment: string;
  
  @Column({
    name: 'branch_id',
    type: 'int',
  })
  branchId: number;

  @Column({
    name: 'branch_name',
    type: 'varchar',
  })
  branchName: string;


  @Column({
    name: 'schedule_branch_office_id',
    type: 'int',
  })
  scheduleBranchOfficeId: number;

  @Column({
    name: 'time',
    type: 'varchar',
  })
  time: string;

  @Column({
    name: 'dentist_id',
    type: 'int',
    nullable: true
  })
  dentistId: number;

  @Column({
    name: 'receptionist_id',
    type: 'int',
    nullable: true
  })
  receptionistId: number;

  @Column({
    name: 'status',
    type: 'varchar',
  })
  status: string;

  @Column({
    name: 'cost_amount',
    type: 'decimal',
    nullable: true,
  })
  costAmount: number;

  @Column({
    name: 'price_amount',
    type: 'decimal',
    nullable: true
  })
  priceAmount: number;


  @Column({
    name: 'prospect_id',
    type: 'int',
    nullable: true
  })
  prospectId: number;

  @Column({
    name: 'patient_id',
    type: 'int',
    nullable: true
  })
  patientId: number;

  @Column({
    name: 'scheduled_at',
    type: 'datetime',
    nullable: true,
  })
  scheduledAt: Date;

  @Column({
    name: 'treatment_category_id',
    type: 'int',
    nullable: true,
  })
  treatmentCategoryId: number;

  @Column({
    name: 'treatment_category',
    type: 'varchar',
    nullable: true,
  })
  treatmentCategory: string;

  @Column({
    name: 'folio',
    type: 'varchar',
    nullable: true,
  })
  folio: string;

  @Column({
    name: 'started_at',
    type: 'datetime',
    nullable: true,
  })
  startedAt: string;


  @Column({
    name: 'finished_at',
    type: 'datetime',
    nullable: true,
  })
  finishedAt: string;

  @Column({
    name: 'comments',
    type: 'varchar',
    nullable: true,
  })
  comments: string;

//   @Column({
//     name: 'dentist_id',
//     type: 'int',
//     comment: 'id del dentista que atendera la cita',
//   })
//   dentistID: number;
  
//   @Column({
//     name: 'receptionist_id',
//     type: 'int',
//     comment: 'id de la recepcionista que recibio al paciente',
//   })
//   receptionistID: number;

//   @Column({
//     name: 'datetime_appointment', 
//     type: 'datetime',
//     comment: 'fecha hora de la cita',
//   })
//   dateTimeAppointdment: Date;

//   @Column({
//     name: 'appointment_type',
//     type: 'varchar',
//     length: 45,
//     comment: 'tipo de cita: seguimiento, cita nueva, reposicion (se cancelo una anterior)',
//   })
//   appointmentType: string;

//   @Column({ 
//     name: 'appointment_reason', 
//     nullable: true })
//   appointmentReason: string;

//   @Column({ name: 'import_service', nullable: true })
//   importService: number;

//   @Column({ name: 'payment_method_service', nullable: true })
//   paymentMethodService: string;

//   @Column({ name: 'import_product', nullable: true })
//   importProduct: number;

//   @Column({ name: 'payment_method_product', nullable: true })
//   paymentMethodProduct: string;

//   @Column({ 
//     name: 'status',
//     type: "varchar",
//     length: 10,
//     nullable: false, 
//   })
//   status: string;

//   @Column({
//     name: 'comments', 
//     type: 'varchar',
//     nullable: true,
//   })
//   comments: string;

//   @Column({
//     name: 'created_at',
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP',
//     nullable: false,
//   })
//   dateTime: Date;


//   // @OneToMany(() => BranchOffice)
//   // @JoinColumn({ name: 'branch_office_id' })
//   // branchOffice: BranchOffice;

//   // @OneToOne(() => Patient)
//   // @JoinColumn({ name: 'client_id' })
//   // patient: Patient;

//   // @OneToOne(() => Employees)
//   // @JoinColumn({ name: 'dentist_id' })
//   // dentist: Employees;

//   // @OneToOne(() => Employees)
//   // @JoinColumn({ name: 'receptionist_id' })
//   // receptionist: Employees;
 }
