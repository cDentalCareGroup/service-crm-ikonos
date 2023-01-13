import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { MunicipalitiesEntity } from './models/municipalities';
import { PatientEntity } from './models/patient.entity';
import { PatientOriginEntity } from './models/patient.origin.entity';
import { StateEntity } from './models/state.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
    imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forFeature([PatientEntity, BranchOfficeEntity,StateEntity,MunicipalitiesEntity,PatientOriginEntity]),
      HttpModule,
    ],
    controllers: [PatientController],
    providers: [PatientService],
  })
export class PatientModule {}
