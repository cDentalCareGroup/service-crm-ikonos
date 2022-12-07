import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { BranchOfficeController } from './branch.office.controller';
import { BranchOfficeService } from './branch.office.service';
import { BranchOfficeEmployeeSchedule } from './models/branch.office.employee.entity';
import { BranchOfficeEntity } from './models/branch.office.entity';
import { BranchOfficeScheduleEntity } from './models/branch.office.schedule.entity';

@Module({
    imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([BranchOfficeEntity, BranchOfficeScheduleEntity,BranchOfficeEmployeeSchedule,EmployeeEntity]),
  ],
  controllers: [BranchOfficeController],
  providers: [BranchOfficeService],
  exports: [BranchOfficeService]
})
export class BranchOfficeModule {}


