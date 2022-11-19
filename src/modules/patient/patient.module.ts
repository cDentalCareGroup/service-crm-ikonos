import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './models/patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
    imports: [
      ConfigModule.forRoot(),
      //TypeOrmModule.forFeature([Patient]),
    ],
    controllers: [PatientController],
    providers: [PatientService],
  })
export class PatientModule {}
