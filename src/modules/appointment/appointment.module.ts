import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/models/entities/user.entity';
import { BranchOfficeEmployeeSchedule } from '../branch_office/models/branch.office.employee.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { BranchOfficeScheduleEntity } from '../branch_office/models/branch.office.schedule.entity';
import { CallCatalogEntity } from '../calls/models/call.catalog.entity';
import { CallEntity } from '../calls/models/call.entity';
import { CallLogEntity } from '../calls/models/call.log.entity';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { EmployeeTypeEntity } from '../employee/models/employee.type.entity';
import { PadComponentUsedEntity } from '../pad/models/pad.component.used.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { PatientOriginEntity } from '../patient/models/patient.origin.entity';
import { MovementsTypeEntity } from '../payment/models/movements.type.entity';
import { PaymentEntity } from '../payment/models/payment.entity';
import { PaymentDetailEntity } from '../payment/payment.detail.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentDetailEntity } from './models/appointment.detail.entity';
import { AppointmentEntity } from './models/appointment.entity';
import { AppointmentServiceEntity } from './models/appointment.service.entity';
import { AppointmentTimesEntity } from './models/appointment.times.entity';
import { PaymentMethodEntity } from './models/payment.method.entity';
import { ProspectEntity } from './models/prospect.entity';
import { ServiceEntity } from './models/service.entity';
import { AccountPayableEntity } from '../payment/models/account.payable.entity';
import { AccountPayableDetailEntity } from '../payment/models/account.payable.detail.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      AppointmentEntity,
      BranchOfficeEntity,
      BranchOfficeScheduleEntity,
      PatientEntity,
      ProspectEntity,
      EmployeeEntity,
      UserEntity,
      BranchOfficeEmployeeSchedule,
      EmployeeTypeEntity,
      ServiceEntity,
      PaymentMethodEntity,
      CallCatalogEntity,
      CallEntity,
      AppointmentServiceEntity,
      AppointmentTimesEntity,
      AppointmentDetailEntity,
      PadComponentUsedEntity,
      PaymentEntity,
      PaymentDetailEntity,
      CallLogEntity,
      PatientOriginEntity,
      MovementsTypeEntity,
      AccountPayableEntity,
      AccountPayableDetailEntity
    ]),
    HttpModule,
    FirebaseModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService]
})
export class AppointmentModule { }
