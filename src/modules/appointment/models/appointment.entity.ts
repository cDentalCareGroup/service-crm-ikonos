import { CallEntity } from "src/modules/calls/models/call.entity";
import { PatientEntity } from "src/modules/patient/models/patient.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({
    name: 'appointment',
    type: 'date',
  })
  appointment: string;

  @Column({
    name: 'branch_id',
    type: 'int',
    nullable: true,
  })
  branchId: number;

  @Column({
    name: 'branch_name',
    type: 'varchar',
    nullable: true,
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

  // @Column({
  //   name: 'cost_amount',
  //   type: 'decimal',
  //   nullable: true,
  // })
  // costAmount: number;

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
    type: 'varchar',
    nullable: true,
  })
  scheduledAt: string;

  // @Column({
  //   name: 'treatment_category_id',
  //   type: 'int',
  //   nullable: true,
  // })
  // treatmentCategoryId: number;

  // @Column({
  //   name: 'treatment_category',
  //   type: 'varchar',
  //   nullable: true,
  // })
  // treatmentCategory: string;

  @Column({
    name: 'folio',
    type: 'varchar',
    nullable: true,
  })
  folio: string;

  @Column({
    name: 'started_at',
    type: 'varchar',
    nullable: true,
  })
  startedAt: string;


  @Column({
    name: 'finished_at',
    type: 'varchar',
    nullable: true,
  })
  finishedAt: string;

  @Column({
    name: 'comments',
    type: 'varchar',
    nullable: true,
  })
  comments: string;

  @Column({
    name: 'has_labs',
    type: 'int',
    nullable: true,
  })
  hasLabs: number;

  @Column({
    name: 'has_cabinet',
    type: 'int',
    nullable: true,
  })
  hasCabinet: number;


  // @Column({
  //   name: 'payment_method_id',
  //   type: 'int'
  // })
  // paymentMethodId: number;



  @Column({
    name: 'next_appointment_id',
    type: 'int',
    nullable: true,
  })
  nextAppointmentId: number;

  @Column({
    name: 'next_appointment_date',
    type: 'varchar',
    nullable: true,
  })
  nextAppointmentDate: string;

  @Column({
    name: 'started_visit_at',
    type: 'varchar',
    nullable: true,
  })
  startedVisitAt: string;

  @Column({
    name: 'referral_code',
    type: 'varchar',
    nullable: true,
  })
  referralCode: string;


  @Column({
    name: 'notes_call_center',
    type: 'text',
  })
  notesCallCenter: string;

  @Column({
    name: 'block_calendar',
    type: 'int',
  })
  blockCalendar: number;
  
  
  call?: CallEntity;
  referralName?: string;
  referralId?: number;


  // @Column({
  //   name: 'dentist_comments',
  //   type: 'text',
  // })
  // dentistComments: string;

  // @Column({
  //   name: 'receptionist_comments',
  //   type: 'text',
  // })
  // receptionistComments: string;


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

//   @ManyToOne(() => PatientEntity, patient => patient.appointments)
// patient: PatientEntity;

}
