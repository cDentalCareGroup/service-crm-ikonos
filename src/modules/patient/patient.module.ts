import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOffice } from '../branch_office/models/branch.office.entity';
import { Patient } from './models/patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
    imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forFeature([Patient, BranchOffice]),
    ],
    controllers: [PatientController],
    providers: [PatientService],
  })
export class PatientModule {}
