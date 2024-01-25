import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '../patient/models/patient.entity';
import { ReportsController } from './reports.controller';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([AppointmentEntity, PatientEntity]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [],
})
export class ReportsModule {}
