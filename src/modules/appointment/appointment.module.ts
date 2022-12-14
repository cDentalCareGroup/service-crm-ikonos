import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { BranchOfficeScheduleEntity } from '../branch_office/models/branch.office.schedule.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentEntity } from './models/appointment.entity';
import { ProspectEntity } from './models/prospect.entity';

@Module({
    imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([AppointmentEntity,BranchOfficeEntity, BranchOfficeScheduleEntity,PatientEntity, ProspectEntity]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
