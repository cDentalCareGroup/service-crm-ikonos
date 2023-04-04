import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { CallEntity } from '../calls/models/call.entity';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { PaymentEntity } from '../payment/models/payment.entity';
import { PaymentDetailEntity } from '../payment/payment.detail.entity';
import { ProspectEntity } from '../appointment/models/prospect.entity';
import { CallCatalogEntity } from '../calls/models/call.catalog.entity';
import { CallLogEntity } from '../calls/models/call.log.entity';
import { ServiceEntity } from '../appointment/models/service.entity';
import { AppointmentDetailEntity } from '../appointment/models/appointment.detail.entity';

@Module({
  imports:[ ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      BranchOfficeEntity, 
      PatientEntity, 
      EmployeeEntity, 
      CallEntity, 
      AppointmentEntity,
      PaymentEntity,
      PaymentDetailEntity,
      ProspectEntity,
      CallCatalogEntity,
      CallLogEntity,
      ServiceEntity,AppointmentDetailEntity
    ]),],
  providers: [StatisticService],
  controllers: [StatisticController]
})
export class StatisticModule {}
