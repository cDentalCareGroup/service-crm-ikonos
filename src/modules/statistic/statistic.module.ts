import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { EmployeeEntity } from '../employee/models/employee.entity';

@Module({
  imports:[ ConfigModule.forRoot(),
    TypeOrmModule.forFeature([BranchOfficeEntity, PatientEntity, EmployeeEntity]),],
  providers: [StatisticService],
  controllers: [StatisticController]
})
export class StatisticModule {}
