import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/models/entities/user.entity';
import { BranchOfficeEmployeeSchedule } from '../branch_office/models/branch.office.employee.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { BranchOfficeScheduleEntity } from '../branch_office/models/branch.office.schedule.entity';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { EmployeeTypeEntity } from '../employee/models/employee.type.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentEntity } from './models/appointment.entity';
import { ProspectEntity } from './models/prospect.entity';

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
      EmployeeTypeEntity
    ]),
    EmailModule
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService,],
  exports: [AppointmentService]
})
export class AppointmentModule {}
