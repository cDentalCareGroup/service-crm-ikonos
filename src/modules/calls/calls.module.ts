import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from '../appointment/appointment.module';
import { AppointmentService } from '../appointment/appointment.service';
import { AppointmentEntity } from '../appointment/models/appointment.entity';
import { ProspectEntity } from '../appointment/models/prospect.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { CallCatalogEntity } from './models/call.catalog.entity';
import { CallEntity } from './models/call.entity';
import { CallLogEntity } from './models/call.log.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([CallEntity, PatientEntity, AppointmentEntity, CallCatalogEntity, ProspectEntity, CallLogEntity]),
    AppointmentModule
  ],
  controllers: [CallsController],
  providers: [CallsService,],
  exports: [CallsService]
})
export class CallsModule { }

