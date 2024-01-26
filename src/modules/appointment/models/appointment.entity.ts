import { CallEntity } from "src/modules/calls/models/call.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}
