

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('branch_schedule_dentist')
export class BranchOfficeEmployeeSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'branch_id',
  })
  branchId: number;

  @Column({
    name: 'branch_schedule_id',
  })
  branchScheduleId: number;

  @Column({
    name: 'dentist_id',
  })
  employeeId: number;

}