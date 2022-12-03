import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('branch_schedule')
export class BranchOfficeScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'branch_id',
    type: 'int'
  })
  branchId: number;


  @Column({
    name: 'day_name',
    type: 'varchar',
    length: 9,
  })
  dayName: string;

  @Column({
    name: 'start_time',
    type: 'time'
  })
  startTime: Date;


  @Column({
    name: 'end_time',
    type: 'time',
  })
  endTime: Date;

  @Column({
    name: 'seat',
    type: 'int'
  })
  seat: number;


  @Column({
    name: 'status',
    type: 'varchar',
    length: 8,
  })
  status: string;

  
}