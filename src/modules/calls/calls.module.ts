import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { CallCatalogEntity } from './models/call.catalog.entity';
import { CallEntity } from './models/call.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([CallEntity, PatientEntity, AppointmentEntity, CallCatalogEntity]),
  ],
  controllers: [CallsController],
  providers: [CallsService],
  exports: []
})
export class CallsModule { }

