import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { PatientEntity } from './models/patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
    imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forFeature([PatientEntity, BranchOfficeEntity]),
    ],
    controllers: [PatientController],
    providers: [PatientService],
  })
export class PatientModule {}
